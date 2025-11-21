import userChatStore from "@/store/userChatStore";
import axiosInstance from "./axiosInstance";

export const getMessages = async (chatId) => {
  if (!chatId) return;

  userChatStore.setState({
    allMessages: [],
    isErrorGettingMessage: false,
    isGettingMessages: true,
  });
  try {
    const res = await axiosInstance.get(`/message/all/${chatId}`);
    const returnArgs = {
      data: res.data,
      isError: false,
    };

    return returnArgs;
  } catch (error) {
    const returnArgs = {
      isError: true,
      errorName: error.response.data.errorName,
    };
    return returnArgs;
  } finally {
    userChatStore.setState({ isGettingMessages: false });
  }
};

export const cleanUpMarkdownText = (text) => {
  //This will clean text so my SpeechSynthesisUtterance so it won't pronounce codes and waste time

  let ttsText = text;

  // Replace all code blocks with a single placeholder
  if (/```[\s\S]*?```/.test(ttsText)) {
    ttsText = ttsText.replace(/```[\s\S]*?```/g, "");
    ttsText += " You can see the code in our chat history.";
  }

  // Replace all table rows with a single placeholder
  if (/^\|.*\|$/m.test(ttsText)) {
    ttsText = ttsText.replace(/^\|.*\|$/gm, "");
    ttsText += " You can see the table in our chat history.";
  }

  // Remove headers, formatting, inline code, links, images, emojis, extra newlines
  ttsText = ttsText
    .replace(/^#+\s+/gm, "") // headers
    .replace(/^---$/gm, "") // horizontal rules
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/`([^`]+)`/g, "") // inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // links
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    ) // emojis
    .replace(/^\s+|\s+$/g, "") // trim spaces
    .replace(/\n{2,}/g, "\n"); // collapse multiple newlines

  return ttsText;
};

export const searchChatWithText = async (text) => {
  userChatStore.setState({ isSearchingMessages: true });
  try {
    const res = await axiosInstance.post("/message/search/chats", { text });
    return res.data;
  } catch (error) {
    console.log("Error quering search Check Internet Connection");
    return null;
  } finally {
    userChatStore.setState({ isSearchingMessages: false });
  }
};
