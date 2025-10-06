import { NextFunction, Request, Response } from "express";
import { projectsServices } from "./projects.service";
import { responseService } from "../../utils/response";

const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    // Multer (cloudinary storage) gives each file a .path (the hosted URL)
    if (files.length > 0) {
      payload.image = files[0].path;
    }

    // Frontend sends techStacks as JSON string; convert and map -> techStack
    if (payload.techStacks && typeof payload.techStacks === "string") {
      try {
        const parsed = JSON.parse(payload.techStacks);
        payload.techStack = Array.isArray(parsed) ? parsed : [];
      } catch {
        payload.techStack = [];
      }
      delete payload.techStacks;
    }

    const created = await projectsServices.createProjectService(payload);
    responseService.successResponse(res, {
      status: 200,
      message: "Project created successfully",
      data: created,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    if (files.length > 0) {
      payload.image = files[0].path;
    }

    if (payload.techStacks && typeof payload.techStacks === "string") {
      try {
        const parsed = JSON.parse(payload.techStacks);
        payload.techStack = Array.isArray(parsed) ? parsed : [];
      } catch {
        payload.techStack = [];
      }
      delete payload.techStacks;
    }

    const updated = await projectsServices.updateProjectService(req.params.id, payload);
    responseService.successResponse(res, {
      status: 200,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await projectsServices.getProjectByIdService(req.params.id);
    responseService.successResponse(res, {
      status: 200,
      message: "Project fetched successfully",
      data,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await projectsServices.getAllProjectsService();
    responseService.successResponse(res, {
      status: 200,
      message: "Projects fetched successfully",
      data,
    });
  }
  catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

export const projectsController = {
  createProject,
  updateProject,
  getProjectById,
  getAllProjects,
};
