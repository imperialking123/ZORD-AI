import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

const protectRoute = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies["ZORDAI_REMOTE_LOCK"];

    if (!token)
      return res.status(401).json({ message: "Unauthorized: No token" });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const userId = payload?.userId;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized: Invalid payload" });

    const findUser = await User.findById(userId).select("-password");
    if (!findUser)
      return res.status(401).json({ message: "Unauthorized: User not found" });

    req.user = findUser;
    next();
  } catch (error) {
    console.error("Error on #protectRoute:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
