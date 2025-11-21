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

  isSearchingMessages: false,

  scrollTo: null,
}));

export default userChatStore;
