import { Request } from "express";
import crypto from "crypto";
import { Visitor, VisitorLog } from "./visitor.model";
import { ITrackVisitPayload, IVisitorLog } from "./visitor.interface";
import {
  extractClientIp,
  parseUserAgent,
  resolveGeolocation,
  EXCLUDED_IPS,
  isExcludedIp,
  isExcludedRequest,
} from "./visitor.helper";
import redis from "../../utils/redis";

/**
 * Records a detailed visitor visit into MongoDB VisitorLog collection.
 */
const recordVisitorLog = async (
  req: Request,
  clientData: Partial<ITrackVisitPayload>
) => {
  // 1. IP & Network
  const { ip, isLocalIp, ipType } = extractClientIp(req);

  // Check if IP / request is excluded (e.g. laptop 103.42.53.244 or admin device)
  if (isExcludedRequest(req, ip)) {
    return null;
  }

  // 2. User Agent & Device parsing
  const rawUserAgent = req.headers["user-agent"] || "";
  const uaDetails = parseUserAgent(rawUserAgent);

  // 3. Geolocation lookup
  const geo = await resolveGeolocation(ip, isLocalIp, req.headers);

  // 4. Session & Visitor ID handling
  const visitorId =
    clientData.visitorId ||
    req.cookies?.visitor_id ||
    crypto.randomUUID();
  const sessionId = clientData.sessionId || crypto.randomUUID();

  // 5. Referrer normalization
  const referrer = clientData.referrer || (req.headers["referer"] as string) || "Direct";
  let referrerDomain = "Direct";
  if (referrer && referrer !== "Direct") {
    try {
      referrerDomain = new URL(referrer).hostname;
    } catch {
      referrerDomain = referrer;
    }
  }

  // 6. Display metrics
  const screenResolution =
    clientData.screenResolution ||
    (clientData.screenWidth && clientData.screenHeight
      ? `${clientData.screenWidth}x${clientData.screenHeight}`
      : undefined);

  const viewportSize =
    clientData.viewportSize ||
    (clientData.viewportWidth && clientData.viewportHeight
      ? `${clientData.viewportWidth}x${clientData.viewportHeight}`
      : undefined);

  // 7. Filter relevant raw headers for audit trail
  const safeHeaders: Record<string, string> = {};
  const allowedHeaderKeys = [
    "user-agent",
    "accept-language",
    "referer",
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "cf-ipcountry",
    "x-vercel-ip-country",
    "x-vercel-ip-city",
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
  ];

  for (const key of allowedHeaderKeys) {
    if (req.headers[key]) {
      safeHeaders[key] = String(req.headers[key]);
    }
  }

  // 8. Build detailed visitor log document
  const logData: Partial<IVisitorLog> = {
    visitorId,
    sessionId,
    isNewVisitor: Boolean(clientData.isNewVisitor),
    visitCount: clientData.visitCount || 1,

    ip,
    ipType,
    isLocalIp,

    country: geo.country,
    countryCode: geo.countryCode,
    region: geo.region,
    city: geo.city,
    zipCode: geo.zipCode,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: geo.timezone,
    isp: geo.isp,
    org: geo.org,
    asn: geo.asn,
    countryFlag: geo.countryFlag,

    userAgent: rawUserAgent,
    browserName: uaDetails.browserName,
    browserVersion: uaDetails.browserVersion,
    browserMajor: uaDetails.browserMajor,
    osName: uaDetails.osName,
    osVersion: uaDetails.osVersion,
    deviceType: uaDetails.deviceType,
    deviceVendor: uaDetails.deviceVendor,
    deviceModel: uaDetails.deviceModel,
    cpuArchitecture: uaDetails.cpuArchitecture,

    isBot: uaDetails.isBot,
    botName: uaDetails.botName,

    screenWidth: clientData.screenWidth,
    screenHeight: clientData.screenHeight,
    screenResolution,
    viewportWidth: clientData.viewportWidth,
    viewportHeight: clientData.viewportHeight,
    viewportSize,
    devicePixelRatio: clientData.devicePixelRatio,
    colorDepth: clientData.colorDepth,
    orientation: clientData.orientation,
    touchSupport: clientData.touchSupport,
    maxTouchPoints: clientData.maxTouchPoints,
    hardwareConcurrency: clientData.hardwareConcurrency,
    deviceMemory: clientData.deviceMemory,

    url: clientData.url || `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    pathname: clientData.pathname || req.path,
    pageTitle: clientData.pageTitle,
    referrer,
    referrerDomain,

    utmSource: clientData.utmSource,
    utmMedium: clientData.utmMedium,
    utmCampaign: clientData.utmCampaign,
    utmTerm: clientData.utmTerm,
    utmContent: clientData.utmContent,

    language: clientData.language || (req.headers["accept-language"]?.split(",")[0] || "Unknown"),
    languages: clientData.languages,
    clientTimezone: clientData.clientTimezone,
    clientTimezoneOffset: clientData.clientTimezoneOffset,
    clientLocalTime: clientData.clientLocalTime,
    connectionType: clientData.connectionType,

    visitedAt: new Date(),
    lastActiveAt: new Date(),
    durationSeconds: 0,

    rawHeaders: safeHeaders,
  };

  // 9. Save to MongoDB
  const savedLog = await VisitorLog.create(logData);

  // 10. Increment daily aggregate counter
  const today = new Date().toISOString().split("T")[0];
  try {
    const key = `visitor_count:${today}`;
    await redis.incr(key);
  } catch (err) {
    // Redis optional, proceed
  }

  try {
    await Visitor.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error updating daily visitor count:", err);
  }

  return savedLog;
};

/**
 * Updates visit duration and last active timestamp for an active session.
 */
const updateVisitDuration = async (
  sessionId: string,
  durationSeconds: number,
  pathname?: string,
  req?: Request
) => {
  if (req && isExcludedRequest(req)) {
    return null;
  }
  if (!sessionId) return null;

  const filter: any = { sessionId };
  if (pathname) {
    filter.pathname = pathname;
  }

  // Find the most recent log entry for this session
  const latestLog = await VisitorLog.findOne(filter).sort({ visitedAt: -1 });

  if (latestLog) {
    if (isExcludedIp(latestLog.ip)) {
      return null;
    }
    const newDuration = Math.max(latestLog.durationSeconds || 0, Math.round(durationSeconds));
    latestLog.durationSeconds = newDuration;
    latestLog.lastActiveAt = new Date();
    await latestLog.save();
    return latestLog;
  }

  return null;
};

/**
 * Backwards compatibility simple visit counter
 */
const trackVisit = async (ip?: string) => {
  if (ip && isExcludedIp(ip)) {
    return;
  }
  const today = new Date().toISOString().split("T")[0];
  const key = `visitor_count:${today}`;

  try {
    await redis.incr(key);
  } catch {
    // Redis optional, proceed to database
  }

  await Visitor.findOneAndUpdate(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
};

/**
 * Retrieve comprehensive aggregated stats including daily visits, device breakdown, top countries, and top pages
 */
const getVisitorStats = async () => {
  const excludeFilter = { ip: { $nin: EXCLUDED_IPS } };

  const [
    dailyRaw,
    totalCountResult,
    totalLogs,
    uniqueVisitors,
    avgDurationResult,
    deviceStats,
    countryStats,
    browserStats,
    topPages,
  ] = await Promise.all([
    Visitor.find().sort({ date: -1 }).limit(30).lean(),
    Visitor.aggregate([
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]),
    VisitorLog.countDocuments(excludeFilter),
    VisitorLog.distinct("visitorId", excludeFilter),
    VisitorLog.aggregate([
      { $match: { durationSeconds: { $gt: 0 }, ...excludeFilter } },
      { $group: { _id: null, avgDuration: { $avg: "$durationSeconds" } } },
    ]),
    VisitorLog.aggregate([
      { $match: excludeFilter },
      {
        $group: {
          _id: { $ifNull: ["$deviceType", "desktop"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]),
    VisitorLog.aggregate([
      { $match: excludeFilter },
      {
        $group: {
          _id: {
            country: { $ifNull: ["$country", "Unknown"] },
            countryCode: { $ifNull: ["$countryCode", "UN"] },
            countryFlag: { $ifNull: ["$countryFlag", "🌐"] },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    VisitorLog.aggregate([
      { $match: excludeFilter },
      {
        $group: {
          _id: { $ifNull: ["$browserName", "Unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    VisitorLog.aggregate([
      { $match: excludeFilter },
      {
        $group: {
          _id: { $ifNull: ["$pathname", "/"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayDoc = dailyRaw.find((d) => d.date === todayStr);

  return {
    summary: {
      totalVisits: totalCountResult[0]?.total || 0,
      totalLogs,
      uniqueVisitors: uniqueVisitors.length,
      todayVisits: todayDoc?.count || 0,
      avgDuration: Math.round(avgDurationResult[0]?.avgDuration || 0),
    },
    daily: [...dailyRaw].reverse(), // Ascending chronological order
    deviceBreakdown: deviceStats.map((d: any) => ({
      name: d._id,
      count: d.count,
    })),
    countryBreakdown: countryStats.map((c: any) => ({
      country: c._id.country,
      countryCode: c._id.countryCode,
      countryFlag: c._id.countryFlag,
      count: c.count,
    })),
    browserBreakdown: browserStats.map((b: any) => ({
      name: b._id,
      count: b.count,
    })),
    topPages: topPages.map((p: any) => ({
      pathname: p._id,
      count: p.count,
    })),
  };
};

/**
 * Retrieve detailed visitor logs (with pagination, search, and filters)
 */
const getVisitorLogs = async (query: {
  page?: number;
  limit?: number;
  country?: string;
  isBot?: boolean;
  deviceType?: string;
  searchTerm?: string;
}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const baseFilter: any = {
    ip: { $nin: EXCLUDED_IPS },
  };

  if (query.country && query.country !== "all") {
    baseFilter.country = new RegExp(query.country, "i");
  }
  if (typeof query.isBot === "boolean") {
    baseFilter.isBot = query.isBot;
  }
  if (query.deviceType && query.deviceType !== "all") {
    baseFilter.deviceType = query.deviceType;
  }

  let finalFilter: any = baseFilter;
  if (query.searchTerm && query.searchTerm.trim() !== "") {
    const term = query.searchTerm.trim();
    const regex = new RegExp(term, "i");
    finalFilter = {
      $and: [
        baseFilter,
        {
          $or: [
            { ip: regex },
            { city: regex },
            { country: regex },
            { browserName: regex },
            { osName: regex },
            { pathname: regex },
            { visitorId: regex },
            { referrer: regex },
            { isp: regex },
          ],
        },
      ],
    };
  }

  const [logs, total] = await Promise.all([
    VisitorLog.find(finalFilter).sort({ visitedAt: -1 }).skip(skip).limit(limit).lean(),
    VisitorLog.countDocuments(finalFilter),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: logs,
  };
};

/**
 * Delete a specific visitor log entry
 */
const deleteVisitorLog = async (id: string) => {
  return await VisitorLog.findByIdAndDelete(id);
};

/**
 * Bulk clear visitor logs (e.g., all logs or bots only)
 */
const clearVisitorLogs = async (type?: string) => {
  if (type === "bots") {
    return await VisitorLog.deleteMany({ isBot: true });
  }
  return await VisitorLog.deleteMany({});
};

export const visitorServices = {
  recordVisitorLog,
  updateVisitDuration,
  trackVisit,
  getVisitorStats,
  getVisitorLogs,
  deleteVisitorLog,
  clearVisitorLogs,
};
