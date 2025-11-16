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
  });

  useEffect(() => {
    if (isStartingChat) return;

    const getMessagesWrapperFunction = async () => {
      const getMessageRes = await getMessages(chatId);

      if (getMessageRes.isError === false) {
        userChatStore.setState({ allMessages: getMessageRes.data });
        const findChatwithChatId = userChatStore
          .getState()
          .allChatHistory.find((chat) => chat._id === chatId);

        if (findChatwithChatId) {
          document.title = findChatwithChatId.title;
          userChatStore.setState({ selectedChat: findChatwithChatId });
        }
      } else if (
        getMessageRes.isError === true &&
        getMessageRes.errorName !== "FAILED_DATA_LOAD"
      ) {
        userChatStore.setState({ allMessages: [] });
        navigate("/", { replace: true });
      }
    };

    if (!isStartingChat && chatId) {
      getMessagesWrapperFunction();
    }
  }, [chatId]);

  return (
    <Flex w="full" h="100vh" direction="column">
      <ChatTopRibbon />

      <ChatMapContainer />

      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        pl={breakPointStyles.inputContainerPL}
        pr={breakPointStyles.inputContainerPR}
      >
        <InputContainer width={{ base: "95%", md: "90%", lg: "100%" }} />
        <Text mt="5px" mb="10px" color="fg.muted" fontSize="xs">
          ZORD AI can make mistakes. so cross check information
        </Text>
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
