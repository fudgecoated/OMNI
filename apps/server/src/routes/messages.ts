import { Router, type IRouter } from "express";
import { AppError } from "../middleware/errorHandler";
import {
  generateFollowup,
  generateMessage,
} from "../writer/messageGenerator";
import type {
  GenerateFollowupRequest,
  GenerateMessageRequest,
} from "@hermes/shared";

export const messagesRouter: IRouter = Router();

messagesRouter.post("/generate", (req, res, next) => {
  try {
    const body = req.body as GenerateMessageRequest;
    if (!body?.person || !body?.student || !body?.templateType) {
      throw new AppError(400, "person, student, and templateType are required");
    }
    res.json(generateMessage(body));
  } catch (err) {
    next(err);
  }
});

messagesRouter.post("/followup", (req, res, next) => {
  try {
    const body = req.body as GenerateFollowupRequest;
    if (!body?.person || !body?.student || !body?.previousMessage) {
      throw new AppError(
        400,
        "person, student, and previousMessage are required"
      );
    }
    const days =
      typeof body.daysSinceContact === "number" ? body.daysSinceContact : 5;
    res.json(generateFollowup({ ...body, daysSinceContact: days }));
  } catch (err) {
    next(err);
  }
});
