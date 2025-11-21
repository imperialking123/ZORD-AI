import { Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppContainer from "./app/AppContainer";
import userAuthStore from "./store/userAuthStore";
import GooglePageContainer from "./pages/auth-pages/GooglePageContainer";
import AuthPageContainer from "./pages/AuthPageContainer";
import "./App.css";
import DiscordPageContainer from "./pages/auth-pages/DiscordPageContainer";
import { GlowLogo } from "./components/logo/Logo";
import { useEffect } from "react";
import { handleCheckAuth } from "./utils/authFunction";
import GithubPageContainer from "./pages/auth-pages/GithubPageContainer";
import NoChatSelected from "./app/NoChatSelected";
import ChatContainer from "./app/chat-component/ChatContainer";

const App = () => {
  const { authUser, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    if (!authUser) {
      handleCheckAuth();
    }
  }, [authUser]);

  if (isCheckingAuth) {
    return (
      <Flex
        minW="full"
        minH="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <GlowLogo />
      </Flex>
    );
  }

  return (
    <Flex
      _dark={{
        bg: "gray.900",
      }}
      minW="full"
      minH="100vh"
    >
      <Routes>
        <Route path="/" element={<AppContainer />}>
          <Route index element={<NoChatSelected />} />
          <Route path="m/:chatId" element={<ChatContainer />} />
        </Route>

        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <AuthPageContainer />}
        >
          <Route path="google" element={<GooglePageContainer />} />
          <Route path="discord" element={<DiscordPageContainer />} />
          <Route path="github/callback" element={<GithubPageContainer />} />
        </Route>
      </Routes>
    </Flex>
  );
};

export default App;
