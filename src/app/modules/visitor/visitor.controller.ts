import { Request, Response } from "express";
import { visitorServices } from "./visitor.service";

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

export const visitorControllers = {
  getStats,
};
