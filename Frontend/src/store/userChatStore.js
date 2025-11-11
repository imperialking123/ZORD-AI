import { create } from "zustand";

const userChatStore = create(() => ({
  isSendingRequest: false,

  showSearchPop: false,

  allChatHistory: [],
  selectedChat: null,

  allMessages: [],
}));

export default userChatStore;
