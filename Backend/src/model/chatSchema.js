import { model, Schema, Types } from "mongoose";

const chatSchema = new Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      required: true,
    },
    title: { type: String, default: "New Chat" },
    hasImages: Boolean,
    howManyImages: Number,
  },
  { timestamps: true }
);

const Chat = model("chat", chatSchema);

export default Chat;
