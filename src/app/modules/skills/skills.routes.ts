import { Router } from "express";
import { skillsController } from "./skills.controller";

export const skillsRoutes = Router();

skillsRoutes.get("/", skillsController.getSkills);
skillsRoutes.get("/skills", skillsController.getSkills);
skillsRoutes.post("/", skillsController.createSkills);
skillsRoutes.post("/skills/add-skills-to-category", skillsController.addSkillsToCategory);
skillsRoutes.post("/skills/upsert-skills-for-category", skillsController.upsertSkillsForCategory);
skillsRoutes.patch("/:id", skillsController.updateSkills);
skillsRoutes.patch("/skills/:id", skillsController.updateSkills);
skillsRoutes.delete("/:id", skillsController.deleteSkills);
skillsRoutes.delete("/skills/:id", skillsController.deleteSkills);