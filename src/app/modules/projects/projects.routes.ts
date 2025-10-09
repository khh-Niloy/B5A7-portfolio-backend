import { Router } from "express";
import { projectsController } from "./projects.controller";
import { multerUpload } from "../../config/multer.config";

export const projectsRoutes = Router()

projectsRoutes.post("/", multerUpload.array("files"), projectsController.createProject)
projectsRoutes.patch("/:id", multerUpload.array("files"), projectsController.updateProject)
projectsRoutes.get("/:id", projectsController.getProjectById)
projectsRoutes.get("/", projectsController.getAllProjects)
