import userAuthStore from "@/store/userAuthStore";
import axiosInstance from "./axiosInstance";
import { io } from "socket.io-client";
import userChatStore from "@/store/userChatStore";

export const getStateToken = async () => {
  userAuthStore.setState({ isFetching: true });
  try {
    const res = await axiosInstance.get("/auth/google/createToken");
    return res.data;
  } catch {
    userAuthStore.setState({
      showLoginReminderAuthError: "Couldn't initialize Google login client",
    });
    return null;
  } finally {
    userAuthStore.setState({ isFetching: false });
  }
};

export const handleGoogleAuth = async (args) => {
  try {
    const res = await axiosInstance.post("/auth/google", { ...args });

    const returnArgs = {
      data: res.data,
      isError: false,
    };

    return returnArgs;
  } catch (error) {
    const returnArgs = {
      message: error.response?.data?.message || "No internet connection",
      isError: true,
    };

    return returnArgs;
  } finally {
    localStorage.removeItem("_zordAIgoogleState");
  }
};

export const handleDiscordAuth = async (code) => {
  try {
    const res = await axiosInstance.post("/auth/discord", { code });
    const returnArgs = {
      data: res.data,
      isError: false,
    };

    return returnArgs;
  } catch (error) {
    const returnArgs = {
      isError: true,
      message: error?.response?.data?.message || "No Internet Connection",
    };

    return returnArgs;
  }
};

export const handleCheckAuth = async () => {
  try {
    const res = await axiosInstance.get("/auth/check");
    userAuthStore.setState({ authUser: res.data.authData });
    userChatStore.setState({ allChatHistory: res.data?.chats || [] });
  } catch {
    userAuthStore.setState({ authUser: null });
  } finally {
    userAuthStore.setState({ isCheckingAuth: false });
  }
};

export const getGithubState = async () => {
  userAuthStore.setState({ isFetchingGithub: true });
  try {
    const res = await axiosInstance.get("/auth/github/createToken");
    return res.data;
  } catch {
    userAuthStore.setState({
      showLoginReminderAuthError: "Couldn't initialize Github login client",
    });
    return null;
  } finally {
    userAuthStore.setState({ isFetchingGithub: false });
  }
};

export const handleGithubAuth = async (args) => {
  try {
    const res = await axiosInstance.post("/auth/github", { ...args });
    const returnArgs = {
      data: res.data,
      isError: false,
    };

    return returnArgs;
  } catch (error) {
    const returnArgs = {
      isError: true,
      message: error.response.data.message || "No internet connection",
    };

    return returnArgs;
  }
};

export const handleEmailLookup = async (email) => {
  userAuthStore.setState({ isRunningEmailLookup: true });
  try {
    const res = await axiosInstance.post("auth/lookup-email", { email: email });
    const returnArgs = {
      ...res.data,
    };

    return returnArgs;
  } catch (error) {
    const returnArgs = {
      isError: true,
      message: error.response?.data?.message || "No internet connection",
    };

    return returnArgs;
  } finally {
    userAuthStore.setState({ isRunningEmailLookup: false });
  }
};

export const connnectSocket = () => {
  const authUser = userAuthStore.getState().authUser;
  const socket = userAuthStore.getState().socket;

  if (!authUser || socket) return;

  const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const newSocket = io(VITE_BACKEND_BASE_URL, {
    withCredentials: true,
    query: {
      userId: authUser._id,
    },
  });

  userAuthStore.setState({ socket: newSocket });
  return;
};
