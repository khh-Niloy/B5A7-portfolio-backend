import { Router } from "express";
import { aboutController } from "./about.controller";
import { multerUpload } from "../../config/multer.config";

export const aboutRoutes = Router();

aboutRoutes.post("/about-content", multerUpload.any(), aboutController.createAbout);
aboutRoutes.get("/about-content", aboutController.getAboutContent);
aboutRoutes.patch("/about-content", multerUpload.any(), aboutController.updateAboutContent);
aboutRoutes.patch("/about-content/:id", multerUpload.any(), aboutController.updateAboutContent);