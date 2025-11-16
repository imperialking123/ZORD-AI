import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { handleGetAllMessages } from "../controllers/messageController.js";

const messageRoute = Router();


messageRoute.get("/all/:chatId", protectRoute, handleGetAllMessages)


export default messageRoute