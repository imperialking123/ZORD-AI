import { Router } from "express";
import {
  handleSendMessage,
  handleStartMessage,
} from "../controllers/chatController.js";

const chatRoute = Router();

chatRoute.post("/send", handleSendMessage);
chatRoute.post("/start", handleStartMessage);

export default chatRoute;
