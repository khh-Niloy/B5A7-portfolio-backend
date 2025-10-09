import { NextFunction, Request, Response } from "express";
import { skillsServices } from "./skills.service";
import { responseService } from "../../utils/response";

const createSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await skillsServices.createSkillsService(req.body);
    responseService.successResponse(res, {
      status: 200,
      message: "Skills created successfully",
      data: created,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const getSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await skillsServices.getSkillsService();
    responseService.successResponse(res, {
      status: 200,
      message: "Skills fetched successfully",
      data,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const updateSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await skillsServices.updateSkillsService(req.params.id, req.body);
    responseService.successResponse(res, {
      status: 200,
      message: "Skills updated successfully",
      data: updated,
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

const addSkillsToCategory = async (req: Request, res: Response, next: NextFunction) => {
  console.log("addSkillsToCategory", req.body);
  try {
    let result;
    if (Array.isArray(req.body)) {
      result = await Promise.all(
        req.body.map((item) =>
          skillsServices.addSkillsToCategoryService(item.category, item.skills)
        )
      );
    } else {
      result = await skillsServices.addSkillsToCategoryService(req.body.category, req.body.skills);
    }
    responseService.successResponse(res, {
      status: 200,
      message: "Skills added to category successfully",
      data: result,
    });
  }
  catch (error) {
    console.error("Add skills to category error:", error);
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

const upsertSkillsForCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("upsertSkillsForCategory", req.body);
    let result;
    if (Array.isArray(req.body)) {
      result = await Promise.all(
        req.body.map((item) =>
          skillsServices.upsertSkillsForCategory(item.category, item.skills)
        )
      );
    } else {
      result = await skillsServices.upsertSkillsForCategory(req.body.category, req.body.skills);
    }
    responseService.successResponse(res, {
      status: 200,
      message: "Skills upserted for category successfully",
      data: result,
    });
  }
  catch (error) {
    console.error("Upsert skills for category error:", error);
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
    });
  }
};

export const skillsController = {
  createSkills,
  getSkills,
  updateSkills,
  addSkillsToCategory,
  upsertSkillsForCategory,
};
