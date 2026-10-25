import { Router } from "express";
import { projectsController } from "./projects.controller";
import { multerUpload } from "../../config/multer.config";

export const projectsRoutes = Router()

projectsRoutes.post("/", multerUpload.any(), projectsController.createProject)
projectsRoutes.patch("/:id", multerUpload.any(), projectsController.updateProject)
projectsRoutes.delete("/:id", projectsController.deleteProject)
projectsRoutes.get("/:id", projectsController.getProjectById)
projectsRoutes.get("/", projectsController.getAllProjects)
