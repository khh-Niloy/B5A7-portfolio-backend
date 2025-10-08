import { NextFunction, Request, Response } from "express";
import { projectsServices } from "./projects.service";
import { responseService } from "../../utils/response";

// Normalizes various incoming tech fields into `techStack: string[]`
const normalizeTechStack = (payload: any) => {
  // Accept multiple possible field names from the client
  const candidates = [
    payload.techStack,
    payload.techStacks,
    payload.tech,
    payload.techs,
  ];

  let source: unknown = undefined;
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && source === undefined) {
      source = candidate;
    }
  }

  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
      // Try JSON array first
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((v) => String(v).trim()).filter(Boolean);
        }
      } catch {
        // Fallback to comma-separated list
      }
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    }
    return [];
  };

  const techStack = toArray(source);
  if (techStack.length > 0) {
    payload.techStack = techStack;
  }

  // Clean up other fields if present to avoid schema conflicts
  delete payload.techStacks;
  delete payload.tech;
  delete payload.techs;

  return payload;
};

// Normalizes various incoming features fields into `features: string[]`
const normalizeFeatures = (payload: any) => {
  const candidates = [
    payload.features,
    payload.feature,
    payload.featuresList,
    payload.featureList,
  ];

  let source: unknown = undefined;
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && source === undefined) {
      source = candidate;
    }
  }

  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((v) => String(v).trim()).filter(Boolean);
        }
      } catch {
        // Fallback to comma-separated list
      }
      return value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    }
    return [];
  };

  const features = toArray(source);
  if (features.length > 0) {
    payload.features = features;
  }

  delete payload.feature;
  delete payload.featuresList;
  delete payload.featureList;

  return payload;
};

// Normalizes various incoming dependencies fields into `dependencies: string`
const normalizeDependencies = (payload: any) => {
  const candidates = [
    payload.dependencies,
    payload.dependency,
    payload.deps,
  ];

  let source: unknown = undefined;
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && source === undefined) {
      source = candidate;
    }
  }

  const toStringValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value
        .map((v) => String(v).trim())
        .filter(Boolean)
        .join(", ");
    }
    if (typeof value === "string") {
      // Try JSON first
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map((v) => String(v).trim())
            .filter(Boolean)
            .join(", ");
        }
        if (typeof parsed === "string") {
          return parsed.trim();
        }
      } catch {
        // Not JSON; keep as entered
      }
      return value.trim();
    }
    // Fallback: stringify
    return String(value ?? "").trim();
  };

  const dependencies = toStringValue(source);
  if (dependencies.length > 0) {
    payload.dependencies = dependencies;
  }

  delete payload.dependency;
  delete payload.deps;

  return payload;
};

const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    // Multer (cloudinary storage) gives each file a .path (the hosted URL)
    if (files.length > 0) {
      payload.image = files[0].path;
    }

    // Normalize tech inputs to techStack: string[]
    normalizeTechStack(payload);
    // Normalize features inputs to features: string[]
    normalizeFeatures(payload);
    // Normalize dependencies input to dependencies: string
    normalizeDependencies(payload);

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
    console.log(req.body);
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    if (files.length > 0) {
      payload.image = files[0].path;
    }

    // Normalize tech inputs to techStack: string[]
    normalizeTechStack(payload);
    // Normalize features inputs to features: string[]
    normalizeFeatures(payload);
    // Normalize dependencies input to dependencies: string
    normalizeDependencies(payload);

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
