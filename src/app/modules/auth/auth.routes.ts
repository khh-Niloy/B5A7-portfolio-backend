import { Router } from "express";
import { authController } from "./auth.controller";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const authRoutes = Router()

authRoutes.post("/login", authController.userLogin)
authRoutes.post("/logout", authController.userLogOut)
authRoutes.get("/get-me", roleBasedProtection, authController.userGetMe)
// authRoutes.patch("/change-password",validateZodSchema(passwordChangeZodSchema), roleBasedAccess(...Object.values(Role)), authController.changePassword)
// authRoutes.post("/refresh-token", authController.getNewAccessToken)