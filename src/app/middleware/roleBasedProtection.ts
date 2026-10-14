import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/envVars";
import { User } from "../modules/auth/user.model";
import { jwtServices } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const roleBasedProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;
    const accessToken = req.cookies?.accessToken || bearerToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in.",
      });
    }

    const userInfo = jwtServices.verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or session expired.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: (error as Error).message || "Unauthorized access.",
    });
  }
};
