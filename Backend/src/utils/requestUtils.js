const retryableCode = [500, 502, 503, 504, 429];

export const doRequestWithRetry = async (requestFunction, maxAttempts) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const result = await requestFunction();
      return result;
    } catch (error) {
      if (!retryableCode.includes(error.status)) {
        throw new Error("Permanent API Error: " + error.message);
      }

      if (attempts === maxAttempts) {
        throw new Error(
          "Failed after " + maxAttempts + " attempts: " + error.message
        );
      }

      const baseDelayMs = 2500;
      const delay = baseDelayMs * Math.pow(2, attempts - 1);

      console.log(
        `Transient error on attempt ${attempts}. Waiting for ${delay}ms.`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const parseAIResponse = (text) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { title: "Untitled", userIntent: "TEXT" };
  }
};
