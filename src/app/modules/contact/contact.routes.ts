import { Router } from "express";
import { contactController } from "./contact.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

const router = Router();

router.post("/", contactController.createContactMessage);
router.get("/", roleBasedProtection, contactController.getAllContactMessages);
router.delete("/:id", roleBasedProtection, contactController.deleteContactMessage);

export const contactRoutes = router;
