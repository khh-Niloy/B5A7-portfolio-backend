import { JwtPayload } from "jsonwebtoken";
import { cookiesService } from "../../utils/cookiesService";
import { Response } from "express";
import { prisma } from "../../../server";
import { jwtServices } from "../../utils/jwt";

interface LoginPayload {
  email: string;
  password: string;
};

const userLoginService = async (payload: LoginPayload) => {
  const { email, password } = payload;

  // console.log(payload)

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new Error("User does not exist, Please register first");
  }

  const isPasswordOK = await jwtServices.checkHashedPassword(
    password as string,
    user.password as string
  );

  if (!isPasswordOK) {
    throw new Error("password is not matched!");
  }

  const jwtPayload = {
    role: user.role,
    email: user.email,
  };

  const accessRefreshToken = jwtServices.generateAccessRefreshToken(
    jwtPayload as JwtPayload
  );
  return { user, accessRefreshToken };
};

const userLogOutService = (res: Response) => {
  cookiesService.clearCookie(res);
};

// const getNewAccessTokenService = async(refreshToken: string)=>{
//     const userInfo = jwtToken.verifyToken(refreshToken)

//     const user = await User.findOne({email: userInfo.email})

//     if(!user){
//         throw new AppError(400, "user is not found");
//     }

//     if(user.isBlocked){
//         throw new AppError(400, "user is blocked");
//     }

//     if(user.isDeleted){
//         throw new AppError(400, "user is deleted");
//     }

//     const jwtPayload = {
//         role: user.role,
//         email: user.email,
//         userId: user._id
//     }

//     const newTokens = jwtToken.generateAccessRefreshToken(jwtPayload)
//     return newTokens
// }

// const changePasswordService = async(payload: { password: string }, user: JwtPayload)=>{
//     const userInfo = await User.findOne({email: user.email})

//     if(!userInfo){
//         throw new AppError(400, "user is not found");
//     }

//     const newHashedPassword = await hashedPasswordFunc.generateHashedPassword(payload.password)
//     await User.findByIdAndUpdate(userInfo._id, {password: newHashedPassword})
// }

export const authServices = {
  userLoginService,
  userLogOutService,
  // getNewAccessTokenService,
  // changePasswordService
};
