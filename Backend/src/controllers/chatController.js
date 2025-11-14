import { FinishReason, GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import systemInstruction from "../utils/systemInstruction.js";
import Chat from "../model/chatSchema.js";
import { doRequestWithRetry, parseAIResponse } from "../utils/requestUtils.js";
import { getSocketIdWithUserId, io } from "../lib/io.js";
import { Socket } from "socket.io";
import Message from "../model/messageSchema.js";
config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

export const handleSendMessage = async (req, res) => {
  const text = req.body?.text;
  const image = req.body?.image;

  if (!text && !image)
    return res.status(400).json({
      message:
        "Cannot send empty request. please include query parameters i.e image and text",
    });

  let queryParameters = {};

  if (image) {
    queryParameters["image"] = image;
  }

  if (text) {
    queryParameters["text"] = text;
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: {
          text: systemInstruction.defaultText,
        },
        temperature: systemInstruction.temperature,
      },
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    function parseModelResponse(raw) {
      // Remove ```json and ``` if present
      const cleaned = raw.replace(/```json\s*|```/g, "").trim();
      return JSON.parse(cleaned);
    }

    const response = parseModelResponse(result.text);

    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message || "Internal Server error. error not specified ",
    });
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
    if (inlineData) {
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
