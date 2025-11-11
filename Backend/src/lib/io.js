import http from "http";
import express from "express";
import { Server } from "socket.io";
import cookie from "cookie";
import cookieParser from "cookie-parser";
import { getUserDetailsWithCookie } from "../controllers/authController.js";

export const app = express();

export const server = http.createServer(app);

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const userSocketMap = new Map();

const userDetailsMap = new Map();

const io = new Server(server, {
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

  console.log(userDetailsMap);

  console.log(
    `New User Connected to Socket. User Id = ${userId}, socketId = ${socket.id} `
  );
});
