import { Router } from "express";
import { visitorControllers } from "./visitor.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

const router = Router();

// Public tracking endpoints (invoked by client tracker)
router.post("/track", visitorControllers.trackVisitor);
router.post("/duration", visitorControllers.recordDuration);

// Protected analytics endpoints
router.get("/stats", roleBasedProtection, visitorControllers.getStats);
router.get("/logs", roleBasedProtection, visitorControllers.getLogs);

export const visitorRoutes = router;
