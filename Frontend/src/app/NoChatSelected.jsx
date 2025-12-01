import { Flex, Heading } from "@chakra-ui/react";
import InputContainer from "./input-component/InputContainer";
import breakPointStyles from "@/utils/breakPointsStyles";
import userAuthStore from "@/store/userAuthStore";
import RequestLogin from "./modals/RequestLogin";
import TopRibbon from "@/components/ui/TopRibbon.jsx";
import { useState } from "react";
import { useParams } from "react-router-dom";
import userChatStore from "@/store/userChatStore";
import ChatTopRibbon from "./chat-component/ChatTopRibbon";

const NoChatSelected = () => {
  const allRandomText = [
    "Where shall we start today?",
    "What would you like to begin with?",
    "What’s on your mind right now?",
    "What shall we focus on first?",
    "Where do you want to start?",
    "What would you like to explore?",
    "How would you like to begin?",
    "What’s the first thing you want to do?",
    "What’s your priority right now?",
    "Where should we start our journey?",
    "What’s the question you want to explore?",
    "What shall we dive into first?",
    "What are we tackling today?",
    "Where do you want to begin?",
    "How would you like to get started?",
  ];
  const { showLoginReminder, authUser, isCheckingAuth } = userAuthStore();
  const { selectedChat } = userChatStore();
  const randomIndex = Math.floor(Math.random() * allRandomText.length);

  const [randomText] = useState(allRandomText[randomIndex]);

  const { chatId } = useParams();

  console.log(chatId);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      minH="full"
      direction="column"
      gap="10"
      pos="relative"
    >
      {showLoginReminder && <RequestLogin />}

      {!isCheckingAuth && !authUser && <TopRibbon />}

      {!isCheckingAuth && authUser && !chatId && !selectedChat && (
        <Flex
          opacity={{ base: 1, md: "0", lg: "0" }}
          minW="full"
          pos="absolute"
          top="0"
        >
          <ChatTopRibbon />
        </Flex>
      )}

      <Heading
        textAlign="center"
        fontFamily="zordTitle"
        userSelect="none"
        fontSize="lg"
        w={{
          base: "98%",
        }}
      >
        {randomText}
      </Heading>

      <Flex
        w={{
          base: "95%",
          md: authUser ? "70%" : "60%",
          lg: authUser ? "70%" : "50%",
        }}
      >
        <InputContainer />
      </Flex>
    </Flex>
  );
};

export default NoChatSelected;
