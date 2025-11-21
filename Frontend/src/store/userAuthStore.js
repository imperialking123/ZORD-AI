import { create } from "zustand";

const userAuthStore = create(() => ({
  showLoginReminder: false,
  showLoginReminderAuthError: null,

  isCheckingAuth: true,
  isFetching: false,
  isFetchingGithub: false,
  isRunningEmailLookup: false,

  authUser: null,
  socket: null,

  isShowSideBar: false,
  showSearchPop: false,
}));

export default userAuthStore;
