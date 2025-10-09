import { Response } from "express";

const setCookie = (res: Response, accessToken: string, refreshToken: string)=>{
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
}

const clearCookie = (res: Response)=>{
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
}

export const cookiesService = {
    setCookie,
    clearCookie
}