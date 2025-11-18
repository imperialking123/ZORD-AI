import { Flex, IconButton, Stack, Text, useClipboard } from "@chakra-ui/react";
import { memo } from "react";
import { GoCopy } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
const CodeRender = ({ match, codeChildren, restProps }) => {
  const clipboard = useClipboard({ value: codeChildren });

  return (
    <Stack bg="gray.950" p="10px" rounded="md">
      <Flex justifyContent="space-between" userSelect="none" w="full">
        <Text fontSize="xs">{match[1]}</Text>
        <IconButton
          onClick={() => clipboard.copy()}
          size="2xs"
          variant="outline"
        >
          {clipboard.copied ? <IoMdCheckmark /> : <GoCopy />}
        </IconButton>
      </Flex>

      <SyntaxHighlighter
        customStyle={{
          backgroundColor: "transparent",
          padding: "0",
          margin: "0",
          whiteSpace: "pre-wrap",
        }}
        wrapLongLines
        style={atomOneDark}
        PreTag="div"
        language={match[1]}
      >
        {codeChildren}
      </SyntaxHighlighter>
    </Stack>
  );
};

export default memo(CodeRender);
