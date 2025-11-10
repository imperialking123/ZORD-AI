import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";
import authRoute from "./routes/authRoute.js";
import ConnectDB from "./utils/db.js";
import { app, server } from "./lib/io.js";

config();



const PORT = process.env.PORT;

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
console.log("Allowed Frontend Origin:", FRONTEND_BASE_URL);

app.use(cors({ origin: FRONTEND_BASE_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

ConnectDB();
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
