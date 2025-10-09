import { Router } from "express";
import { aboutController } from "./about.controller";

export const aboutRoutes = Router()

aboutRoutes.post("/about-content", aboutController.createAbout)
aboutRoutes.get("/about-content", aboutController.getAboutContent)
aboutRoutes.patch("/about-content/:id", aboutController.updateAboutContent)