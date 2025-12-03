import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";
import authRoute from "./routes/authRoute.js";
import { app, server } from "./lib/io.js";
import messageRoute from "./routes/messageRoute.js";
import { ConnectDB } from "./utils/db.js";

config();

const PORT = process.env.PORT;

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
console.log("Allowed Frontend Origin:", FRONTEND_BASE_URL);
app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
  })
);

// Handle OPTIONS preflight
app.options("/api/*", cors({ origin: FRONTEND_BASE_URL, credentials: true }));


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

ConnectDB();
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
