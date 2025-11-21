import Message from "../model/messageSchema.js";
import Chat from "../model/chatSchema.js";
import { doRequestWithRetry, parseAIResponse } from "../utils/requestUtils.js";
import { getSocketIdWithUserId, io } from "../lib/io.js";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import systemInstruction from "../utils/systemInstruction.js";
import mongoose from "mongoose";
import { ImageKitUploader } from "../utils/db.js";
import { response } from "express";

config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

export const handleGetAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        messages: "Unsupport Arguments Passed",
        errorName: "INVALID_ARGS",
      });
    }

    if (!chatId)
      return res
        .status(400)
        .json({ message: "Invalid Argument, Chat Id missing" });

    const findChat = await Chat.findById(chatId);

    if (!findChat)
      return res.status(400).json({
        message: "Invalid Argument, Chat Id is Invalid",
        errorName: "NotExist",
      });

    const messages = await Message.find({ chatId })
      .sort({
        createdAt: 1,
      })
      .lean();

    if (messages === null || undefined)
      return res.status(400).json({
        messages: "Messages could not Be Loaded",
        errorName: "FAILED_DATA_LOAD",
      });

    return res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Error on  #handleGetAllMessages #messageController.js ",
      error
    );
  }
};

export const handleStartMessage = async (args) => {
  try {
    const { text, inlineData, role, userDetails, incomingMessageId } = args;

    const contents = {
      role: role,
    };

    if (text) {
      contents.text = text;
    }
    if (inlineData && inlineData.data) {
      const newInlineData = {
        data: inlineData.data.replace(/^data:image\/\w+;base64,/, ""),
        mimeType: inlineData.mimeType,
      };
      contents.inlineData = newInlineData;
    }

    const apiCallWrapper = () =>
      ai.models.generateContent({
        model: "gemini-2.0-flash",
        config: {
          systemInstruction: {
            text: systemInstruction.startInstruction.text,
          },
        },

        contents: [{ ...contents }],
      });

    const startChatResult = await doRequestWithRetry(apiCallWrapper, 3);

    const startChatParsed = parseAIResponse(startChatResult.text);

    const newChat = await Chat.create({
      ownerId: userDetails._id,
      title: startChatParsed.title,
      hasMessage: true,
    });

    const newUserMessage = await Message.create({
      ...contents,
      msgType: startChatParsed.userIntent,
      chatId: newChat._id,
      userId: newChat.ownerId,
      role: "user",
    });

    const userSocketId = getSocketIdWithUserId(userDetails._id);

    io.to(userSocketId).emit("receive-chat-client", newChat);

    let attempts = 0;
    const maxAttempts = 4;

    if (startChatParsed.userIntent === "TEXT") {
      while (attempts < maxAttempts) {
        attempts++;

        try {
          const contentStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            config: {
              systemInstruction: {
                text: systemInstruction.defaultText,
              },
            },

            contents: [{ ...contents }],
          });

          let allText = "";

          for await (const chunk of contentStream) {
            allText += chunk.text;

            let resendChunk = {
              text: chunk.text,
              incomingMessageId: incomingMessageId,
              isFinished: chunk.candidates[0].finishReason === "STOP",
            };
            io.to(userSocketId).emit("receive-message-client", resendChunk);
          }

          const newMessage = await Message.create({
            userId: userDetails._id,
            chatId: newChat._id,
            role: "model",
            text: allText,
            msgType: "TEXT",
          });

          console.log(
            `Finished Streaming Chunk to user with id = ${userDetails._id}`
          );

          break;
        } catch (error) {
          console.log(
            "Error Generating Response with gemini retries = ",
            attempts,
            error.message || error
          );

          const baseDelayMs = 2500;
          const delay = baseDelayMs * Math.pow(2, attempts - 1);

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  } catch (error) {
    console.log("Error on #handleStartMessage chatController.js", error);
  }
};

export const handleSendMessage = async (args) => {
  try {
    const { text, inlineData, role, userDetails, incomingMessageId, chatId } =
      args;

    if (!chatId) {
      return;
    }

    const findChat = await Chat.findOne({ _id: chatId });

    const allMessage = await Message.find({ chatId })
      .limit(10)
      .sort({ createdAt: -1 })
      .lean();

    const userContent = {
      role: role,
      parts: [],
    };

    if (text) {
      userContent.parts.push({ text: text });
    }

    if (inlineData && inlineData.data) {
      userContent.parts.push({
        inlineData: {
          data: inlineData.data.replace(/^data:image\/\w+;base64,/, ""),
          mimeType: inlineData.mimeType,
        },
      });
    }

    const reverseMessage = allMessage.reverse();

    const historyContents = [];

    for (const message of reverseMessage) {
      let messageContent = { role: message.role, parts: [] };

      if (message.text) {
        messageContent.parts.push({ text: message.text });
      }

      if (message.inlineData && message.inlineData.data) {
        try {
          const dataResponse = await fetch(message.inlineData.data);
          const arrayBuffer = await dataResponse.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");

          messageContent.parts.push({
            inlineData: {
              data: base64,
              mimeType: message.mimeType,
            },
          });
        } catch (error) {
          console.log("Error Fetching and Transforming Url to Base64", error);
        }
      }

      historyContents.push(messageContent);
    }

    const userSaveArgs = {
      chatId: chatId,
      userId: userDetails._id,
      text: text,
      role: "user",
    };

    if (inlineData && inlineData.data) {
      const extension = inlineData.mimeType.split("/")[1];
      const fileName = `chat-upload-${Date.now()}.${extension}`;
      const imageResponse = await ImageKitUploader.upload({
        file: inlineData.data.replace(/^data:image\/\w+;base64,/, ""),
        fileName: fileName,
      });

      userSaveArgs.fileId = imageResponse.fileId;
      userSaveArgs.inlineData.data = imageResponse.url;
      userSaveArgs.inlineData.mimeType = inlineData.mimeType;
    }

    const newUserMessage = await Message.create({ ...userSaveArgs });

    const newChat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [...historyContents],
    });

    const userSocketId = getSocketIdWithUserId(userDetails._id);

    let fullTextReponse = "";

    let attempts = 0;
    const maxAttempts = 4;

    let modelResponseWorked = true;

    while (attempts < maxAttempts) {
      try {
        const modelResponseStream = await newChat.sendMessageStream({
          message: userContent,
        });

        for await (const chunk of modelResponseStream) {
          fullTextReponse += chunk.text;
          const chunkObject = {
            text: chunk.text,
            incomingMessageId: incomingMessageId,
            isFinished: chunk.candidates[0].finishReason === "STOP",
          };

          if (userSocketId) {
            io.to(userSocketId).emit("receive-message-client", chunkObject);
          }
        }

        modelResponseWorked = true;

        break;
      } catch (error) {
        attempts += 1;
        const baseDelayMs = 4000;
        const delay = baseDelayMs * Math.pow(2, attempts - 1);
        console.log("Error using Model attempts ", attempts);

        modelResponseWorked = false;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (modelResponseWorked) {
      const newModelMessage = await Message.create({
        role: "model",
        text: fullTextReponse,
        chatId: chatId,
        msgType: "TEXT",
      });

      await findChat.updateOne({
        lastActivity: new Date(),
      });
    } else {
      await findChat.updateOne({
        lastActivity: new Date(),
      });
      const chunkObject = {
        text: "Failed to generate a response. Please try again.",
        incomingMessageId: incomingMessageId,
        isFinished: true,
      };

      io.to(userSocketId).emit("receive-message-client", chunkObject);
    }
  } catch (error) {}
};

export const handleSearchMessageOrChat = async (req, res) => {
  try {
    const user = req.user;
    const text = req.body?.text;

    if (!text)
      return res.status(400).json({ message: "Text is required To search" });

    const searchResults = await Message.find(
      { userId: user._id, $text: { $search: text } },
      { score: { $meta: "textScore" }, text: 1 }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean()
      .populate("chatId");

    const regEx = new RegExp(text, "gi");

    let finalResults = [];

    searchResults.forEach((message) => {
      const index = message.text.indexOf(text);

      if (index === -1) {
        return;
      } else {
        const start = Math.max(0, index - 45);
        const end = Math.min(message.text.length, index + text.length + 45);

        const slicedText = message.text.slice(start, end);

        const hightlightedText = slicedText.replace(
          regEx,
          `<mark>${text}</mark>`
        );

        const finishedText = `...${hightlightedText}...`;

        finalResults.push({ ...message, text: finishedText });
      }
    });

    return res.status(200).json(finalResults);
  } catch (error) {
    console.log("Error on #handleSearchMessage #messageController.js  ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
