import { NextFunction, Request, Response } from "express";
import { aboutServices } from "./about.service";
import { responseService } from "../../utils/response";

const createAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.body);
    const aboutContent = await aboutServices.createAboutService(req.body);
    responseService.successResponse(res, {
      status: 200,
      message: "About created successfully",
      data: aboutContent,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getAboutContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const aboutContent = await aboutServices.getAboutContentService();
    responseService.successResponse(res, {
      status: 200,
      message: "About content fetched successfully",
      data: aboutContent,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const updateAboutContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedAboutContent = await aboutServices.updateAboutContentService(req.body, req.params.id);
    responseService.successResponse(res, {
      status: 200,
      message: "About content updated successfully",
      data: updatedAboutContent,
    });
  }
  catch (error) {
    console.error("Update error:", error);
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

export const aboutController = {
  createAbout,
  getAboutContent,
  updateAboutContent,
};
