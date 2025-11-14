import { Flex } from "@chakra-ui/react";
import UserMessage from "./userMessageItem";
import breakPointStyles from "@/utils/breakPointsStyles";
import userChatStore from "@/store/userChatStore";
import IsGettingResponse from "./ai-message-render/IsGettingResponse";
import AiMessageContainer from "./ai-message-render/AiMessageContainer";

const ChatMapContainer = () => {
  const { allMessages } = userChatStore();

  return (
    <Flex
      pl={breakPointStyles.chatMapContainerPL}
      pr={breakPointStyles.chatMapContainerPR}
      pb="10px"
      w="full"
      flex="1"
      overflowY="scroll"
      minH="0"
      direction="column"
      gap="10px"
      userSelect="text"
    >
      {allMessages.map((message, index) => {
        if (message.role === "user")
          return <UserMessage messageData={message} key={index} />;

        if (message.role === "model")
          return <AiMessageContainer key={index} messageData={message} />;
      })}

      <IsGettingResponse />
    </Flex>
  );
};

export default ChatMapContainer;
