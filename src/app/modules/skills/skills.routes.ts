import { Router } from "express";
import { skillsController } from "./skills.controller";

export const skillsRoutes = Router()

skillsRoutes.get("/skills", skillsController.getSkills)
skillsRoutes.post("/skills/add-skills-to-category", skillsController.addSkillsToCategory)
skillsRoutes.post("/skills/upsert-skills-for-category", skillsController.upsertSkillsForCategory)