import { Flex } from "@chakra-ui/react";
import UserMessage from "./userMessageItem";
import breakPointStyles from "@/utils/breakPointsStyles";
import userChatStore from "@/store/userChatStore";

const ChatMapContainer = () => {
  const { allMessages } = userChatStore();

  return (
    <Flex
      pl={breakPointStyles.chatMapContainerPL}
      pr={breakPointStyles.chatMapContainerPR}
      pb="10px"
      w="full"
      flex="1" // 1. Grow to fill space
      overflowY="scroll" // 2. Enable internal scrolling
      minH="0" // 3. CRITICAL: Allows Flexbox to constrain this box
      direction="column"
      gap="10px"
    >
      {allMessages.map((message) => {
        if (message.role === "user") return <UserMessage />;
        // You'll want to map the AI message here too:
        // if (message.role === "ai") return <AiMessage />;
      })}
    </Flex>
  );
};

export default ChatMapContainer;
