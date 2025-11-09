import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";
import authRoute from "./routes/authRoute.js";
import ConnectDB from "./utils/db.js";

config();
const server = express();

const PORT = process.env.PORT;

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
console.log("Allowed Frontend Origin:", FRONTEND_BASE_URL);

server.use(cors({ origin: FRONTEND_BASE_URL, credentials: true }));
server.use(express.json());
server.use(cookieParser());

server.use("/api/auth", authRoute);
server.use("/api/chat", chatRoute);

ConnectDB();
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
