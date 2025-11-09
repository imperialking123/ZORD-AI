import { Flex, Heading } from "@chakra-ui/react";
import InputContainer from "./input-component/InputContainer";
import breakPointStyles from "@/utils/breakPointsStyles";
import userAuthStore from "@/store/userAuthStore";
import RequestLogin from "./modals/RequestLogin";
import TopRibbon from "@/components/ui/topRibbon";
import { useState } from "react";

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
  const randomIndex = Math.floor(Math.random() * allRandomText.length);

  const [randomText] = useState(allRandomText[randomIndex]);

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

      <Heading
        textAlign="center"
        fontFamily="zordTitle"
        userSelect="none"
        fontSize="2xl"
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
