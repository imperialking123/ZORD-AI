import { create } from "zustand";

const userChatStore = create(() => ({
  isSendingRequest: false,

  showSearchPop: false,

  inputText: " ",
}));

export default userChatStore;
