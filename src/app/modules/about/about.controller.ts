import { NextFunction, Request, Response } from "express";
import { aboutServices } from "./about.service";
import { responseService } from "../../utils/response";

const extractPayload = (req: Request) => {
  let payload: any = { ...req.body };
  if (payload.data && typeof payload.data === "string") {
    try {
      const parsed = JSON.parse(payload.data);
      payload = { ...parsed, ...payload };
      delete payload.data;
    } catch {}
  }

  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length > 0) {
    payload.avatar = files[0].path;
  }
  if (req.file) {
    payload.avatar = req.file.path;
  }

  return payload;
};

const createAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = extractPayload(req);
    const aboutContent = await aboutServices.createAboutService(payload);
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
    const payload = extractPayload(req);
    const id = req.params.id;
    const updatedAboutContent = await aboutServices.updateAboutContentService(payload, id);
    responseService.successResponse(res, {
      status: 200,
      message: "About content updated successfully",
      data: updatedAboutContent,
    });
  } catch (error) {
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
