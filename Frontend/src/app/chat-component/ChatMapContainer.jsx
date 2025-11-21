import { Box, Flex } from "@chakra-ui/react";
import UserMessage from "./user-message-render/UserMessageItem";
import userChatStore from "@/store/userChatStore";
import IsGettingResponse from "./ai-message-render/IsGettingResponse";
import "@/assets/stylesheets/noScrollbar.css";
import AiMessageContainer from "./ai-message-render/AiMessageContainer";
const ChatMapContainer = () => {
  const { allMessages } = userChatStore();

  return (
    <Flex
      pb="10px"
      pt="10px"
      minW={{
        base: "98%",
        lg: "75%",
        md: "85%",
      }}
      maxW="75%"
      flex="1"
      overflowY="scroll"
      minH="0"
      direction="column"
      gap="10px"
      userSelect="text"
    >
      {allMessages.length > 0 &&
        allMessages.map((message, index) => {
          if (message.role === "user")
            return <UserMessage messageData={message} key={index} />;

          if (message.role === "model")
            return <AiMessageContainer  key={index} messageData={message} />;
        })}

      <IsGettingResponse />

      <Box minW="full" minH="150px" bg="transparent" />
    </Flex>
  );
};

export default ChatMapContainer;
