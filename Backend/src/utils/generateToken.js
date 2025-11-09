import jwt from "jsonwebtoken";

export const generateJWTCookie = (userId, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const SERVER_STAGE = process.env.SERVER_STAGE; // "dev" or "prod"

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const COOKIE_NAME = "ZORDAI_REMOTE_LOCK";

  res.cookie(COOKIE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, 
    secure: SERVER_STAGE === "prod", 
    sameSite: SERVER_STAGE === "prod" ? "none" : "lax", 
  });
};
