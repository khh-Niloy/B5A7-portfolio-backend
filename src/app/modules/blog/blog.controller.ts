import { NextFunction, Request, Response } from "express";
import { blogServices } from "./blog.service";
import { responseService } from "../../utils/response";

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    if (files.length > 0) {
      payload.coverImage = files[0].path;
    }

    if (payload.publishDate && typeof payload.publishDate === "string") {
      payload.publishDate = new Date(payload.publishDate);
    }

    const created = await blogServices.createBlogService(payload);
    responseService.successResponse(res, {
      status: 200,
      message: "Blog created successfully",
      data: created,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    if (files.length > 0) {
      payload.coverImage = files[0].path;
    }

    if (payload.publishDate && typeof payload.publishDate === "string") {
      payload.publishDate = new Date(payload.publishDate);
    }

    const updated = await blogServices.updateBlogService(req.params.id, payload);
    responseService.successResponse(res, {
      status: 200,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await blogServices.getBlogByIdService(req.params.id);
    responseService.successResponse(res, {
      status: 200,
      message: "Blog fetched successfully",
      data,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await blogServices.getAllBlogsService();
    responseService.successResponse(res, {
      status: 200,
      message: "Blogs fetched successfully",
      data,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

export const blogController = {
  createBlog,
  updateBlog,
  getBlogById,
  getAllBlogs,
};


