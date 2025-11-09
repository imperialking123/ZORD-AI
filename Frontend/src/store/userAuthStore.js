import { create } from "zustand";

const userAuthStore = create(() => ({
  showLoginReminder: false,
  showLoginReminderAuthError: null,

  isCheckingAuth: true,
  isFetching: false,
  isFetchingGithub: false,
  isRunningEmailLookup: false,

  authUser: null,
}));

export default userAuthStore;
