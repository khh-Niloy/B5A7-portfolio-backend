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
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new Error("access token not found!");
  }

  const userInfoJWTAccessToken = jwtServices.verifyToken(
    accessToken,
    envVars.JWT_ACCESS_SECRET
  ) as JwtPayload;

  const user = await User.findOne({ email: userInfoJWTAccessToken.email });

  if (!user) {
    throw new Error("user found!");
  }

  req.user = user;

  next();
};
