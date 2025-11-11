import { Flex } from "@chakra-ui/react";
import UserMessage from "./userMessageItem";
import breakPointStyles from "@/utils/breakPointsStyles";

const ChatMapContainer = () => {
  return (
    <Flex
      pl={breakPointStyles.chatMapContainerPL}
      pr={breakPointStyles.chatMapContainerPR}
      w="full"
      flex="1"
      direction="column"
    >
      <UserMessage />
    </Flex>
  );
};

export default ChatMapContainer;
