import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema({
  chatId: Types.ObjectId,
  userId: Types.ObjectId,
  role: {
    type: String,
    enum: ["user", "model"],
  },
  text: String,
  inlineData: {
    mimeType: String,
    data: String,
  },
  msgType: {
    type: String,
    enum: ["TEXT", "IMAGE"],
  },
});

const Message = model("message", messageSchema);

export default Message;
