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
router.delete("/logs/:id", roleBasedProtection, visitorControllers.deleteLog);
router.delete("/logs", roleBasedProtection, visitorControllers.clearLogs);

export const visitorRoutes = router;
