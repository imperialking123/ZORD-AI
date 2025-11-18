import { Flex, Text } from "@chakra-ui/react";
import ChatTopRibbon from "./ChatTopRibbon";
import InputContainer from "../input-component/InputContainer";
import ChatMapContainer from "./ChatMapContainer";
import breakPointStyles from "@/utils/breakPointsStyles";
import { useEffect } from "react";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { getMessages } from "@/utils/chatFunctions";
import userChatStore from "@/store/userChatStore";

const ChatContainer = () => {
  const { authUser } = userAuthStore();
  const { isStartingChat } = userChatStore();

  const navigate = useNavigate();

  const { chatId } = useParams();

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (isStartingChat) return;

    const storeHasMessages = userChatStore.getState().allMessages.length > 0;
    if (storeHasMessages) return;

    const getMessagesWrapperFunction = async () => {
      const res = await getMessages(chatId);

      if (!res.isError) {
        userChatStore.setState({ allMessages: res.data });
        const chat = userChatStore
          .getState()
          .allChatHistory.find((c) => c._id === chatId);
        if (chat) {
          document.title = chat.title;
          userChatStore.setState({ selectedChat: chat });
        }
      } else if (res.isError && res.errorName !== "FAILED_DATA_LOAD") {
        navigate("/", { replace: true });
      }
    };

    if (chatId) getMessagesWrapperFunction();
  }, [chatId, isStartingChat]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="full"
      h="100vh"
      direction="column"
    >
      <ChatTopRibbon />

      <ChatMapContainer />

      <Flex
        direction="column"
        alignItems="center"
        width={{ base: "95%", md: "90%", lg: "75%" }}
      >
        <InputContainer />
        <Text mt="5px" mb="10px" color="fg.muted" fontSize="xs">
          ZORD AI can make mistakes. so cross check information
        </Text>
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
