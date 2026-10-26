import { Request } from "express";
import { UAParser } from "ua-parser-js";
import redis from "../../utils/redis";

// In-memory cache fallback if Redis is not available or disconnected
const memoryGeoCache = new Map<string, { data: any; expiry: number }>();

export interface IGeoResult {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  asn?: string;
  countryFlag?: string;
}

/**
 * Known owner/admin IPs to exclude from tracking & analytics
 */
export const EXCLUDED_IPS: string[] = [
  "103.42.53.244", // User's laptop
  ...(process.env.EXCLUDED_IPS
    ? process.env.EXCLUDED_IPS.split(",").map((s) => s.trim()).filter(Boolean)
    : []),
];

/**
 * Checks if a given IP address belongs to the excluded list.
 */
export const isExcludedIp = (ip?: string | null): boolean => {
  if (!ip) return false;
  const clean = ip.trim();
  return EXCLUDED_IPS.some(
    (ex) => clean === ex || clean.startsWith(ex)
  );
};

/**
 * Checks if a request originates from an excluded IP or contains an excluded IP in headers.
 */
export const isExcludedRequest = (req: Request, ip?: string): boolean => {
  if (ip && isExcludedIp(ip)) return true;
  const detected = extractClientIp(req).ip;
  if (isExcludedIp(detected)) return true;

  const xff = String(req.headers["x-forwarded-for"] || "");
  const cf = String(req.headers["cf-connecting-ip"] || "");
  const real = String(req.headers["x-real-ip"] || "");

  return EXCLUDED_IPS.some(
    (ex) => xff.includes(ex) || cf.includes(ex) || real.includes(ex)
  );
};

/**
 * Normalizes and extracts the real client IP address from request headers or socket.
 */
export const extractClientIp = (
  req: Request
): { ip: string; isLocalIp: boolean; ipType: string } => {
  let ip = "";

  // 1. Cloudflare header
  const cfConnectingIp = req.headers["cf-connecting-ip"];
  if (cfConnectingIp && typeof cfConnectingIp === "string") {
    ip = cfConnectingIp.trim();
  }

  // 2. X-Real-IP
  if (!ip) {
    const xRealIp = req.headers["x-real-ip"];
    if (xRealIp && typeof xRealIp === "string") {
      ip = xRealIp.trim();
    }
  }

  // 3. X-Forwarded-For (can be comma-separated list: client, proxy1, proxy2)
  if (!ip) {
    const xForwardedFor = req.headers["x-forwarded-for"];
    if (xForwardedFor) {
      const forwarded = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor;
      const first = forwarded.split(",")[0]?.trim();
      if (first) {
        ip = first;
      }
    }
  }

  // 4. Fallback to Express req.ip or socket remote address
  if (!ip) {
    ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  }

  // Clean IPv6 mapped IPv4 address: ::ffff:192.168.1.1 -> 192.168.1.1
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  // Normalize localhost
  if (ip === "::1" || ip === "localhost") {
    ip = "127.0.0.1";
  }

  // Determine if it's a private / local network IP
  const isLocalIp =
    ip === "127.0.0.1" ||
    ip === "0.0.0.0" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
    ip.startsWith("fc00:") ||
    ip.startsWith("fe80:");

  const ipType = ip.includes(":") ? "IPv6" : "IPv4";

  return { ip, isLocalIp, ipType };
};

/**
 * Parses user agent string and extracts browser, OS, device, and bot detection.
 */
export const parseUserAgent = (userAgent: string) => {
  const ua = userAgent || "";
  const parser = new UAParser(ua);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();
  const cpu = parser.getCPU();

  // Bot detection regular expression
  const botPatterns: { name: string; pattern: RegExp }[] = [
    { name: "Googlebot", pattern: /googlebot/i },
    { name: "Bingbot", pattern: /bingbot/i },
    { name: "YandexBot", pattern: /yandexbot/i },
    { name: "Baiduspider", pattern: /baiduspider/i },
    { name: "DuckDuckBot", pattern: /duckduckbot/i },
    { name: "Twitterbot", pattern: /twitterbot/i },
    { name: "LinkedInBot", pattern: /linkedinbot/i },
    { name: "FacebookBot", pattern: /facebookexternalhit/i },
    { name: "Discordbot", pattern: /discordbot/i },
    { name: "WhatsApp", pattern: /whatsapp/i },
    { name: "TelegramBot", pattern: /telegrambot/i },
    { name: "Slackbot", pattern: /slackbot/i },
    { name: "Lighthouse", pattern: /chrome-lighthouse/i },
    { name: "UptimeRobot", pattern: /uptimerobot/i },
    { name: "Pingdom", pattern: /pingdom/i },
    { name: "Curl/Wget", pattern: /(curl|wget)/i },
    { name: "Generic Bot/Crawler", pattern: /(bot|crawler|spider|crawling|slurp)/i },
  ];

  let isBot = false;
  let botName = "";

  for (const bot of botPatterns) {
    if (bot.pattern.test(ua)) {
      isBot = true;
      botName = bot.name;
      break;
    }
  }

  // Device type normalization
  let deviceType: string = device.type || "desktop";
  if (isBot) {
    deviceType = "bot";
  }

  return {
    browserName: browser.name || "Unknown",
    browserVersion: browser.version || "Unknown",
    browserMajor: browser.major,
    osName: os.name || "Unknown",
    osVersion: os.version || "Unknown",
    deviceType,
    deviceVendor: device.vendor,
    deviceModel: device.model,
    cpuArchitecture: cpu.architecture,
    isBot,
    botName: isBot ? botName : undefined,
  };
};

/**
 * Resolves geolocation for an IP address using:
 * 1. CDN/Vercel headers (if present)
 * 2. Redis/Memory Cache
 * 3. ipwho.is API (HTTPS, high precision)
 * 4. ip-api.com API (fallback)
 */
export const resolveGeolocation = async (
  ip: string,
  isLocalIp: boolean,
  reqHeaders: Record<string, any>
): Promise<IGeoResult> => {
  // If private or loopback IP, return local dev metadata
  if (isLocalIp) {
    return {
      country: "Localhost / Private Network",
      countryCode: "LOC",
      region: "Development",
      city: "Localhost",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      isp: "Local Loopback",
      org: "Local Network",
      countryFlag: "💻",
    };
  }

  // 1. Check if Vercel / Cloudflare edge headers are provided
  const headerCountry =
    reqHeaders["x-vercel-ip-country"] || reqHeaders["cf-ipcountry"];
  const headerCity = reqHeaders["x-vercel-ip-city"];
  const headerRegion = reqHeaders["x-vercel-ip-country-region"];
  const headerLat = reqHeaders["x-vercel-ip-latitude"];
  const headerLon = reqHeaders["x-vercel-ip-longitude"];
  const headerTimezone = reqHeaders["x-vercel-ip-timezone"];

  if (headerCountry && headerCountry !== "XX") {
    return {
      country: headerCountry,
      countryCode: headerCountry,
      region: headerRegion || "Unknown",
      city: headerCity ? decodeURIComponent(headerCity) : "Unknown",
      latitude: headerLat ? parseFloat(headerLat) : undefined,
      longitude: headerLon ? parseFloat(headerLon) : undefined,
      timezone: headerTimezone || undefined,
      isp: "Edge CDN",
    };
  }

  // 2. Check Cache (Redis or Memory)
  const cacheKey = `geo:${ip}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Redis might be down, check in-memory cache
    const memCached = memoryGeoCache.get(cacheKey);
    if (memCached && memCached.expiry > Date.now()) {
      return memCached.data;
    }
  }

  // 3. Query primary external geo provider: ipwho.is (HTTPS, fast, rich data)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: controller.signal,
      headers: { "User-Agent": "Portfolio-Analytics/1.0" },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const result: IGeoResult = {
          country: data.country || "Unknown",
          countryCode: data.country_code || "Unknown",
          region: data.region || "Unknown",
          city: data.city || "Unknown",
          zipCode: data.postal,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone?.id,
          isp: data.connection?.isp || data.connection?.org,
          org: data.connection?.org,
          asn: data.connection?.asn ? `AS${data.connection.asn}` : undefined,
          countryFlag: data.flag?.emoji,
        };

        // Cache for 24 hours
        try {
          await redis.set(cacheKey, JSON.stringify(result), "EX", 86400);
        } catch {
          memoryGeoCache.set(cacheKey, {
            data: result,
            expiry: Date.now() + 86400 * 1000,
          });
        }

        return result;
      }
    }
  } catch (error) {
    // Primary lookup failed or timed out, attempt fallback
  }

  // 4. Secondary fallback: ip-api.com
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        const result: IGeoResult = {
          country: data.country || "Unknown",
          countryCode: data.countryCode || "Unknown",
          region: data.regionName || "Unknown",
          city: data.city || "Unknown",
          zipCode: data.zip,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          asn: data.as,
        };

        try {
          await redis.set(cacheKey, JSON.stringify(result), "EX", 86400);
        } catch {
          memoryGeoCache.set(cacheKey, {
            data: result,
            expiry: Date.now() + 86400 * 1000,
          });
        }

        return result;
      }
    }
  } catch {
    // Silently fall back to default
  }

  return {
    country: "Unknown",
    countryCode: "Unknown",
    region: "Unknown",
    city: "Unknown",
  };
};
