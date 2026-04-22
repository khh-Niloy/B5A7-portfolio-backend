import { Router } from "express";
import { visitorControllers } from "./visitor.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

const router = Router();

router.get("/stats", roleBasedProtection, visitorControllers.getStats);

export const visitorRoutes = router;
