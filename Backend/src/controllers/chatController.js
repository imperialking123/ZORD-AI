import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import systemInstruction from "../utils/systemInstruction.js";
import Chat from "../model/chatSchema.js";
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

export const handleStartMessage = async (req, res) => {
  const user = req.user;

  try {
    const { text, image } = req.body;

    const queryParameters = {};

    if (text) {
      queryParameters["text"] = text;
    }

    if (image) {
      queryParameters["inlineData"] = {
        mimeType: image.mimeType,
        data: image.data,
      };
    }

    const titleResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: queryParameters,
      config: {
        systemInstruction: {
          text: systemInstruction.startInstruction.text,
        },
      },
    });

    const returnObject = {};

    const newChat = await Chat.create({
      ownerId: user._id,
      title: titleResponse.text,
    });

    const mainResponse = await ai.models.generateContent({
      config: {
        systemInstruction: {
          text: systemInstruction.defaultText,
        },
      },
      contents: queryParameters,
    });

    returnObject.chat = newChat.toObject();
  } catch (error) {
    console.log("Error on #handleStartMessage chatController.js", error);
  }
};
