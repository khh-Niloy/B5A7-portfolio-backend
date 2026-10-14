import { NextFunction, Request, Response } from "express";
import { visitorServices } from "../modules/visitor/visitor.service";

export const trackVisitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Avoid running on OPTIONS preflight or dedicated tracking endpoints
    if (
      req.method === "OPTIONS" ||
      req.path.startsWith("/visitors/track") ||
      req.path.startsWith("/visitors/duration")
    ) {
      return next();
    }

    // Only set fallback cookie if missing
    const visitorToken = req.cookies?.visitor_id;
    if (!visitorToken) {
      const generatedId = Math.random().toString(36).substring(2, 15);
      res.cookie("visitor_id", generatedId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      await visitorServices.trackVisit();
    }
  } catch (error) {
    console.error("Error in trackVisitor middleware:", error);
  }
  next();
};
