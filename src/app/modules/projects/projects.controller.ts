import { NextFunction, Request, Response } from "express";
import { projectsServices } from "./projects.service";
import { responseService } from "../../utils/response";

const normalizeTechStack = (payload: any) => {
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
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((v) => String(v).trim()).filter(Boolean);
        }
      } catch {
        return [];
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

  delete payload.techStacks;
  delete payload.tech;
  delete payload.techs;

  return payload;
};

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
        return [];
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

const normalizeDependencies = (payload: any) => {
  const candidates = [payload.dependencies, payload.dependency, payload.deps];

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
        return "";
      }
      return value.trim();
    }
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

const validateProjectType = (payload: any) => {
  const validTypes = ["client project", "personal project"];

  // Check if projectType exists in the payload (even if it's an empty string or undefined)
  if (
    "projectType" in payload ||
    payload.projectType !== undefined
  ) {
    let projectType = String(payload.projectType || "").trim();

    // Handle "undefined" string case
    if (projectType === "undefined" || projectType === "") {
      projectType = "personal project";
    }

    // Validate the projectType
    if (!validTypes.includes(projectType)) {
      throw new Error(`projectType must be one of: ${validTypes.join(", ")}`);
    }

    // Set the validated projectType
    payload.projectType = projectType;
  } else {
    // If projectType is not provided at all, set default for create operations
    // (For updates, we handle this in the service)
    payload.projectType = "personal project";
  }

  return payload;
};

const handleProjectImages = (payload: any, files: Express.Multer.File[]) => {
  // 1. Thumbnail file for cards
  const thumbnailFile = files.find(
    (f) => f.fieldname === "thumbnail" || f.fieldname === "image"
  );
  if (thumbnailFile) {
    payload.image = thumbnailFile.path;
  } else if (!payload.image && files.length > 0 && files[0].fieldname === "files") {
    payload.image = files[0].path;
  }

  // 2. Existing images (when editing, frontend can send existingImages as JSON string or array)
  let existingImages: string[] = [];
  const rawExisting = payload.existingImages !== undefined ? payload.existingImages : payload.images;
  if (rawExisting !== undefined && rawExisting !== null) {
    try {
      const parsed = typeof rawExisting === "string" ? JSON.parse(rawExisting) : rawExisting;
      if (Array.isArray(parsed)) {
        existingImages = parsed.map((img) => String(img).trim()).filter(Boolean);
      } else if (typeof parsed === "string") {
        existingImages = [parsed.trim()].filter(Boolean);
      }
    } catch {
      if (typeof rawExisting === "string") {
        existingImages = rawExisting
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
  }

  // 3. New gallery files uploaded
  const newGalleryFiles = files.filter(
    (f) =>
      f.fieldname === "images" ||
      f.fieldname === "gallery" ||
      (f.fieldname === "files" && f !== thumbnailFile)
  );
  const newGalleryUrls = newGalleryFiles.map((f) => f.path);

  // If new gallery images or existing images were provided, update payload.images
  if (
    newGalleryUrls.length > 0 ||
    payload.existingImages !== undefined ||
    (payload.images !== undefined && typeof payload.images === "string")
  ) {
    payload.images = [...existingImages, ...newGalleryUrls];
  } else if (!payload.images && existingImages.length > 0) {
    payload.images = existingImages;
  }

  // If payload.image exists and payload.images is empty or not set, ensure thumbnail is in images
  if (payload.image && (!payload.images || payload.images.length === 0)) {
    payload.images = [payload.image];
  }

  delete payload.existingImages;
};

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Create project request body:", req.body);
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    handleProjectImages(payload, files);

    normalizeTechStack(payload);
    normalizeFeatures(payload);
    normalizeDependencies(payload);
    validateProjectType(payload);

    console.log("Payload after normalization:", payload);
    console.log("projectType in payload:", payload.projectType);

    const created = await projectsServices.createProjectService(payload);
    responseService.successResponse(res, {
      status: 200,
      message: "Project created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Create project error:", error);
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Update request body:", req.body);
    const files = (req.files as Express.Multer.File[]) || [];
    const payload: any = { ...req.body };

    console.log("Files:", files);
    console.log("Payload before normalization:", payload);

    handleProjectImages(payload, files);

    normalizeTechStack(payload);
    normalizeFeatures(payload);
    normalizeDependencies(payload);
    validateProjectType(payload);
    console.log(
      "DEBUG: technicalHighlights in req.body:",
      req.body.technicalHighlights
    );

    console.log("Payload after normalization:", payload);
    console.log("projectType in payload:", payload.projectType);

    const updated = await projectsServices.updateProjectService(
      req.params.id,
      payload
    );
    responseService.successResponse(res, {
      status: 200,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update project error:", error);
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await projectsServices.getAllProjectsService();
    responseService.successResponse(res, {
      status: 200,
      message: "Projects fetched successfully",
      data,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await projectsServices.deleteProjectService(req.params.id);
    if (!deleted) {
      return responseService.errorResponse(res, {
        status: 404,
        message: "Project not found",
      });
    }
    responseService.successResponse(res, {
      status: 200,
      message: "Project deleted successfully",
      data: deleted,
    });
  } catch (error) {
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
  deleteProject,
};
