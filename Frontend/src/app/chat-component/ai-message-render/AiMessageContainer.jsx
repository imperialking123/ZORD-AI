import { Flex } from "@chakra-ui/react";
import MarkdownRenderer from "./ui/MarkDownRenderer";

const AiMessageContainer = ({ messageData }) => {
  return (
    <Flex
      fontFamily="bodyText"
      direction="column"
      gap="10px"
      opacity="0.98"
      
    >
      <MarkdownRenderer>
        {String(messageData.text).replace(/(\[.*?\])/g, "$1\n")}
      </MarkdownRenderer>
    </Flex>
  );
};

export default AiMessageContainer;
