import http from "http";
import express from "express";
import { Server } from "socket.io";
import cookie from "cookie";
import { getUserDetailsWithCookie } from "../controllers/authController.js";
import {
  handleSendMessage,
  handleStartMessage,
} from "../controllers/messageController.js";

export const app = express();

export const server = http.createServer(app);

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const userSocketMap = new Map();

const userDetailsMap = new Map();

export const getSocketIdWithUserId = (userId) => {
  return userSocketMap.get(userId.toString());
};

export const io = new Server(server, {
  cors: {
    origin: FRONTEND_BASE_URL,
    credentials: true,
  },
});

io.use((socket, next) => {
  const userId = socket.handshake.query.userId;
  if (!userId) socket.disconnect();

  next();
});

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  userSocketMap.set(userId, socket.id);

  const cookies = socket.handshake.headers.cookie;

  const ZORDAI_COOKIE = cookie.parse(cookies).ZORDAI_REMOTE_LOCK;

  if (!ZORDAI_COOKIE) {
    socket.disconnect();
    return;
  }

  const userDetais = await getUserDetailsWithCookie(ZORDAI_COOKIE);
  if (!userDetais) socket.disconnect();
  userDetailsMap.set(userId, userDetais);

  socket.on("start-chat-server", (args) => {
    const userDetails = userDetailsMap.get(userId);

    if (!userDetails) return;
    const fullArgs = {
      ...args,
      userDetails,
    };

    handleStartMessage(fullArgs);
  });

  socket.on("send-chat-server", (args) => {
    const userDetails = userDetailsMap.get(userId);

    if (!userDetails) return;
    const fullArgs = {
      ...args,
      userDetails,
    };

    handleSendMessage(fullArgs);
  });
});
