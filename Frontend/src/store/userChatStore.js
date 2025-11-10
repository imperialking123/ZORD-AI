import { create } from "zustand";

const userChatStore = create(() => ({
  isSendingRequest: false,

  showSearchPop: false,

  selectedChat: null,

}));

export default userChatStore;
