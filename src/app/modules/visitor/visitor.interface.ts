export interface IVisitor {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ITrackVisitPayload {
  visitorId: string;
  sessionId: string;
  isNewVisitor: boolean;
  visitCount: number;

  url: string;
  pathname: string;
  pageTitle?: string;
  referrer?: string;
  referrerDomain?: string;

  // Display & Device metrics
  screenWidth?: number;
  screenHeight?: number;
  screenResolution?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  viewportSize?: string;
  devicePixelRatio?: number;
  colorDepth?: number;
  orientation?: string;

  // Hardware & capabilities
  touchSupport?: boolean;
  maxTouchPoints?: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;

  // Locale & Network
  language?: string;
  languages?: string[];
  clientTimezone?: string;
  clientTimezoneOffset?: number;
  clientLocalTime?: string;
  connectionType?: string;

  // Campaign
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface IVisitorLog {
  // Identification
  visitorId: string;
  sessionId: string;
  isNewVisitor: boolean;
  visitCount: number;

  // Network & IP
  ip: string;
  ipType: string;
  isLocalIp: boolean;

  // Geolocation
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

  // Device & User Agent Info
  userAgent: string;
  browserName: string;
  browserVersion: string;
  browserMajor?: string;
  osName: string;
  osVersion: string;
  deviceType: string; // desktop, mobile, tablet, bot, etc.
  deviceVendor?: string;
  deviceModel?: string;
  cpuArchitecture?: string;

  // Bot Information
  isBot: boolean;
  botName?: string;

  // Display & Screen
  screenWidth?: number;
  screenHeight?: number;
  screenResolution?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  viewportSize?: string;
  devicePixelRatio?: number;
  colorDepth?: number;
  orientation?: string;
  touchSupport?: boolean;
  maxTouchPoints?: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;

  // Navigation & Page
  url: string;
  pathname: string;
  pageTitle?: string;
  referrer?: string;
  referrerDomain?: string;

  // Campaign UTMs
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  // Locale & Time
  language?: string;
  languages?: string[];
  clientTimezone?: string;
  clientTimezoneOffset?: number;
  clientLocalTime?: string;
  connectionType?: string;

  // Engagement & Duration
  visitedAt: Date;
  lastActiveAt?: Date;
  durationSeconds?: number;

  // Raw Headers (for complete auditability if needed)
  rawHeaders?: Record<string, string>;
}

export interface IVisitorDurationPayload {
  visitorId: string;
  sessionId: string;
  durationSeconds: number;
  pathname?: string;
}
