import { useColorModeValue } from "@/components/ui/color-mode";
import userChatStore from "@/store/userChatStore";
import { Flex, Button, Text } from "@chakra-ui/react";
const ChatList = () => {
  const { allChatHistory, selectedChat } = userChatStore();

  const bg = useColorModeValue("gray.200", "gray.800");
  const color = useColorModeValue("gray.900", "white");
  const hoverColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Flex direction="column" userSelect="none" mt="10px" w="full" flexGrow={1}>
      <Button
        rounded="md"
        justifyContent="flex-start"
        variant="plain"
        size="sm"
        w="full"
      >
        <Text color="fg.muted">Chats</Text>
      </Button>

      {allChatHistory.length > 0 &&
        allChatHistory.map((chat, index) => (
          <Button
            bg={chat === selectedChat ? bg : "none"}
            color={color}
            rounded="lg"
            justifyContent="flex-start"
            size="sm"
            w="full"
            _hover={{
              bg: hoverColor,
            }}
            key={chat?._id || index}
          >
            <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {chat.title}
            </Text>
          </Button>
        ))}
    </Flex>
  );
};

export default ChatList;
