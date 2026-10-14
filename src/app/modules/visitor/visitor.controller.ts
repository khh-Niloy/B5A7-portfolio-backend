import { Request, Response } from "express";
import { visitorServices } from "./visitor.service";

/**
 * Controller to record a detailed visitor visit
 */
const trackVisitor = async (req: Request, res: Response) => {
  try {
    const log = await visitorServices.recordVisitorLog(req, req.body);

    // Set cookie if not already present
    if (!req.cookies?.visitor_id && log.visitorId) {
      res.cookie("visitor_id", log.visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
    }

    res.status(201).json({
      success: true,
      message: "Visitor tracked successfully",
      data: {
        id: log._id,
        visitorId: log.visitorId,
        sessionId: log.sessionId,
        ip: log.ip,
        country: log.country,
        city: log.city,
      },
    });
  } catch (error: any) {
    console.error("Error in trackVisitor controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to track visitor",
    });
  }
};

/**
 * Controller to record session duration / time on page
 */
const recordDuration = async (req: Request, res: Response) => {
  try {
    const { sessionId, durationSeconds, pathname } = req.body;
    await visitorServices.updateVisitDuration(
      sessionId,
      Number(durationSeconds) || 0,
      pathname
    );

    res.status(200).json({
      success: true,
      message: "Visitor duration recorded",
    });
  } catch (error: any) {
    console.error("Error in recordDuration controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to record duration",
    });
  }
};

/**
 * Controller to retrieve aggregate daily visitor counts
 */
const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await visitorServices.getVisitorStats();
    res.status(200).json({
      success: true,
      message: "Visitor stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve visitor stats",
    });
  }
};

/**
 * Controller to retrieve detailed visitor logs (Admin protected)
 */
const getLogs = async (req: Request, res: Response) => {
  try {
    const result = await visitorServices.getVisitorLogs({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      country: req.query.country as string,
      isBot:
        req.query.isBot !== undefined
          ? req.query.isBot === "true"
          : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Visitor logs retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve visitor logs",
    });
  }
};

export const visitorControllers = {
  trackVisitor,
  recordDuration,
  getStats,
  getLogs,
};
