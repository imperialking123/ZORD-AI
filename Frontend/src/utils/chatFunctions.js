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
