import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    profile: {
      avatar: String,
    },
    oauth_provider: {
      type: String,
      enum: ["google", "discord", "github"],
    },
    provider_id: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    loginType: {
      type: String,
      enum: ["email", "oauth", "both"],
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;
