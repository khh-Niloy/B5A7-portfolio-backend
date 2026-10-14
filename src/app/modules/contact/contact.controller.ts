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

const getAllContactMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const messages = await contactServices.getAllContactMessages();
    responseService.successResponse(res, {
      status: 200,
      message: "Contact messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 500,
      message: (error as Error).message || "Failed to fetch contact messages",
    });
  }
};

const deleteContactMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const deleted = await contactServices.deleteContactMessage(req.params.id);
    if (!deleted) {
      return responseService.errorResponse(res, {
        status: 404,
        message: "Contact message not found",
      });
    }
    responseService.successResponse(res, {
      status: 200,
      message: "Contact message deleted successfully",
      data: deleted,
    });
  } catch (error) {
    responseService.errorResponse(res, {
      status: 500,
      message: (error as Error).message || "Failed to delete contact message",
    });
  }
};

export const contactController = {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
};
