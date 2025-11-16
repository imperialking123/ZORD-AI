import { model, Schema, Types } from "mongoose";

const chatSchema = new Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: { type: String, default: "New Chat" },
    hasImages: Boolean,
    howManyImages: Number,
    hasMessage: Boolean,
    tokenUsage: Number,
  },
  { timestamps: true }
);

const Chat = model("chat", chatSchema);

export default Chat;
