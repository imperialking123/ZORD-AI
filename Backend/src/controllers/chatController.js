



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
