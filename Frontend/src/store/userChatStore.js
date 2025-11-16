import { create } from "zustand";

const userChatStore = create(() => ({
  isSendingMessage: false,
  isStartingChat: false,

  showSearchPop: false,

  allChatHistory: [],
  selectedChat: null,
  incomingMessageId: null,

  isErrorGettingMessage: false,
  isGettingMessages: false,
  allMessages: [],
}));

export default userChatStore;
