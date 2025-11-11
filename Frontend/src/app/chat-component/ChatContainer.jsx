import { Flex, Text } from "@chakra-ui/react";
import ChatTopRibbon from "./ChatTopRibbon";
import InputContainer from "../input-component/InputContainer";
import ChatMapContainer from "./ChatMapContainer";

const ChatContainer = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="full"
      h="full"
      direction="column"
    >
      <ChatTopRibbon />

      <ChatMapContainer />

      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        w="65%"
      >
        <InputContainer />

        <Text
          mt="5px"
          mb="10px"
          userSelect="none"
          color="fg.muted"
          fontSize="xs"
        >
          ZORD AI can make mistakes. so cross check information
        </Text>
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
