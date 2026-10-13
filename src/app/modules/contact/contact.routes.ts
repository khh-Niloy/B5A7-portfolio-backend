import { Router } from "express";
import { contactController } from "./contact.controller";

const router = Router();

router.post("/", contactController.createContactMessage);

export const contactRoutes = router;
