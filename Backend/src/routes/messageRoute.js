import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  handleGetAllMessages,
  handleSearchMessageOrChat,
} from "../controllers/messageController.js";

const messageRoute = Router();

messageRoute.get("/all/:chatId", protectRoute, handleGetAllMessages);
messageRoute.post("/search/chats", protectRoute, handleSearchMessageOrChat);

export default messageRoute;
