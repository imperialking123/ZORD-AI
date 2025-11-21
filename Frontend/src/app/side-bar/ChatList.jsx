import { useColorModeValue } from "@/components/ui/color-mode";
import userAuthStore from "@/store/userAuthStore";
import userChatStore from "@/store/userChatStore";
import { Flex, Button, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
const ChatList = () => {
  const { allChatHistory, selectedChat } = userChatStore();

  const bg = useColorModeValue("gray.200", "gray.800");
  const color = useColorModeValue("gray.900", "white");
  const hoverColor = useColorModeValue("gray.300", "gray.700");

  const { chatId } = useParams();
  const navigate = useNavigate();

  const handleNavigateToChat = (chatData) => {
    if (chatId && chatId === chatData._id) return;
    document.title = chatData.title;
    userChatStore.setState({
      selectedChat: chatData,
      allMessages: [],
      isStartingChat: false,
      isSendingMessage: false,
    });
    userAuthStore.setState({ isShowSideBar: false });
    speechSynthesis.cancel();
    navigate(`/m/${chatData._id.toString()}`);
  };

  return (
    <Flex
      direction="column"
      userSelect="none"
      mt="10px"
      w="full"
      flex="1"
      overflowY="scroll"
      minH="0"
      flexGrow={1}
    >
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
            fontWeight="meduim"
            value={chat}
            onClick={() => handleNavigateToChat(chat)}
            bg={chat === selectedChat ? bg : "none"}
            color={color}
            rounded="lg"
            justifyContent="flex-start"
            size="sm"
            w="99%"
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
