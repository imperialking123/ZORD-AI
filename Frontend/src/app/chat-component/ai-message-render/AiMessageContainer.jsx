import Markdown from "react-markdown";
import CodeRender from "./CodeRender";
import { Flex } from "@chakra-ui/react";

const AiMessageContainer = ({ messageData }) => {
  return (
    <Flex
      p="10px"
      lineHeight="moderate"
      fontFamily="bodyText"
      direction="column"
      gap="10px"
      mb="10px"
      opacity="0.98"
    >
      <Markdown
        children={messageData.text}
        components={{
          code: CodeRender,
        }}
      ></Markdown>
    </Flex>
  );
};

export default AiMessageContainer;
