import { Response } from "express";
import { envVars } from "../config/envVars";

interface TResponse<T> {
    status?: number;
    success?: boolean;
    message?: string;
    data?: T;
    metaData?: number
}

export const successResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.status as number).json({
        success: true,
        message: data.message,
        metaData: data.metaData,
        data: envVars.NODE_ENV === "development" ? data.data : null
    })
}

export const errorResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.status as number).json({
        success: false,
        message: data.message,
        // data: envVars.NODE_ENV === "development" ? data.data: null
    })
}

export const responseService = {
    successResponse,
    errorResponse
}