import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Types.ObjectId,
    ref: "chat",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
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
  fileId: String,
});

const Message = mongoose.model("message", messageSchema);

export default Message;
