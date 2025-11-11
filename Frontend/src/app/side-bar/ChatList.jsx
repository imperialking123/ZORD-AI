import { Flex, Button, Text } from "@chakra-ui/react";
const ChatList = () => {
  return (
    <Flex userSelect="none" mt="10px" w="full" flexGrow={1}>
      <Button
        rounded="md"
        justifyContent="flex-start"
        variant="plain"
        size="sm"
        w="full"
      >
        <Text color="fg.muted">Chats</Text>
      </Button>
    </Flex>
  );
};

export default ChatList;
