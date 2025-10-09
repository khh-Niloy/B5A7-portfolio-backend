import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import { cookiesService } from "../../utils/cookiesService";
import { responseService } from "../../utils/response";

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userLogin = await authServices.userLoginService(req.body);
    const { accessRefreshToken } = userLogin;

    cookiesService.setCookie(
      res,
      accessRefreshToken.accessToken,
      accessRefreshToken.refreshToken
    );

    responseService.successResponse(res, {
      status: 200,
      message: "user logged in",
      data: userLogin,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 401,
      message: (error as Error).message,
      // data: error,
    })
  }
};

const userLogOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    authServices.userLogOutService(res);
    responseService.successResponse(res, {
      status: 200,
      message: "user logged out",
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 400,
      message: (error as Error).message,
      // data: error,
    })
  }
};

// const getNewAccessToken = async(req: Request, res: Response, next: NextFunction)=>{
//     try {
//         const refreshToken = req.cookies.refreshToken
//         // console.log(refreshToken)

//         if(!refreshToken){
//             throw new AppError(400, "refresh token not found from cookies");
//         }

//         const tokens = await authServices.getNewAccessTokenService(refreshToken)

//         cookiesManagement.setCookies(res, tokens.accessToken, tokens.refreshToken)

//         successResponse(res, {
//             status: 201,
//             message: "new access and refresh token added",
//             data: tokens
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// const changePassword = async(req: Request, res: Response, next: NextFunction)=>{
//     try {
//         const user = req.user
//         await authServices.changePasswordService(req.body, user)
//         successResponse(res, {
//             status: 201,
//             message: "password changed",
//         })
//     } catch (error) {
//         next(error)
//     }
// }

export const authController = {
  userLogin,
  userLogOut,
  // getNewAccessToken,
  // changePassword
};
