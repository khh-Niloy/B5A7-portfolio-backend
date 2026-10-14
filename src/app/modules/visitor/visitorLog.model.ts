import { Schema, model } from "mongoose";
import { IVisitorLog } from "./visitor.interface";

const visitorLogSchema = new Schema<IVisitorLog>(
  {
    // Identification
    visitorId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    isNewVisitor: { type: Boolean, default: false },
    visitCount: { type: Number, default: 1 },

    // Network & IP
    ip: { type: String, required: true, index: true },
    ipType: { type: String, default: "IPv4" },
    isLocalIp: { type: Boolean, default: false },

    // Geolocation
    country: { type: String, default: "Unknown", index: true },
    countryCode: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown", index: true },
    zipCode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    timezone: { type: String },
    isp: { type: String },
    org: { type: String },
    asn: { type: String },
    countryFlag: { type: String },

    // Device & User Agent
    userAgent: { type: String, required: true },
    browserName: { type: String, default: "Unknown", index: true },
    browserVersion: { type: String, default: "Unknown" },
    browserMajor: { type: String },
    osName: { type: String, default: "Unknown", index: true },
    osVersion: { type: String, default: "Unknown" },
    deviceType: { type: String, default: "desktop", index: true },
    deviceVendor: { type: String },
    deviceModel: { type: String },
    cpuArchitecture: { type: String },

    // Bot detection
    isBot: { type: Boolean, default: false, index: true },
    botName: { type: String },

    // Display & Screen
    screenWidth: { type: Number },
    screenHeight: { type: Number },
    screenResolution: { type: String },
    viewportWidth: { type: Number },
    viewportHeight: { type: Number },
    viewportSize: { type: String },
    devicePixelRatio: { type: Number },
    colorDepth: { type: Number },
    orientation: { type: String },
    touchSupport: { type: Boolean },
    maxTouchPoints: { type: Number },
    hardwareConcurrency: { type: Number },
    deviceMemory: { type: Number },

    // Navigation & Page
    url: { type: String, required: true },
    pathname: { type: String, required: true, index: true },
    pageTitle: { type: String },
    referrer: { type: String, default: "Direct" },
    referrerDomain: { type: String, default: "Direct" },

    // Campaign UTMs
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    utmTerm: { type: String },
    utmContent: { type: String },

    // Locale & Time
    language: { type: String, default: "Unknown" },
    languages: [{ type: String }],
    clientTimezone: { type: String },
    clientTimezoneOffset: { type: Number },
    clientLocalTime: { type: String },
    connectionType: { type: String },

    // Engagement & Duration
    visitedAt: { type: Date, default: Date.now, index: true },
    lastActiveAt: { type: Date, default: Date.now },
    durationSeconds: { type: Number, default: 0 },

    // Raw Headers for full auditability
    rawHeaders: { type: Map, of: String },
  },
  {
    timestamps: true,
    collection: "visitor_logs",
  }
);

// Compound indexes for optimal querying
visitorLogSchema.index({ visitedAt: -1 });
visitorLogSchema.index({ visitorId: 1, visitedAt: -1 });
visitorLogSchema.index({ sessionId: 1, visitedAt: -1 });
visitorLogSchema.index({ ip: 1, visitedAt: -1 });

export const VisitorLog = model<IVisitorLog>("VisitorLog", visitorLogSchema);
