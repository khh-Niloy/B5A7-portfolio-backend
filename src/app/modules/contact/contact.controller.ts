import { Request, Response } from "express";
import { contactServices } from "./contact.service";
import { responseService } from "../../utils/response";

const createContactMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return responseService.errorResponse(res, {
        status: 400,
        message: "Name, email, and message are required fields.",
      });
    }

    const savedMessage = await contactServices.createContactMessage({
      name,
      email,
      message,
    });

    responseService.successResponse(res, {
      status: 200,
      message: "Message sent successfully!",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    responseService.errorResponse(res, {
      status: 500,
      message: (error as Error).message || "Failed to send message",
    });
  }
};

export const contactController = {
  createContactMessage,
};
