import { NextFunction, Request, Response } from "express";
import { visitorServices } from "../modules/visitor/visitor.service";

export const trackVisitor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // We only want to track unique-ish visits or at least not every single internal request.
    // However, for simplicity as requested, we track the visit.
    // We could check for a cookie to avoid double counting in the same session.
    
    const visitorToken = req.cookies.visitor_id;
    if (!visitorToken) {
      // Set a cookie for 24h to identify a session
      res.cookie("visitor_id", "visited", {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      });
      await visitorServices.trackVisit();
    }
  } catch (error) {
    console.error("Error tracking visitor:", error);
  }
  next();
};
