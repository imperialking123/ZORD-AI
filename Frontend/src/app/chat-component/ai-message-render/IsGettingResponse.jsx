import { Flex, Image, Spinner, Text } from "@chakra-ui/react";
import LogoBlack from "@/assets/LogoBlack.svg";
import LogoWhite from "@/assets/LogoWhite.svg";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useEffect, useRef } from "react";
import userChatStore from "@/store/userChatStore";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate } from "react-router-dom";

const IsGettingResponse = () => {
  const { isSendingMessage, isStartingChat, allChatHistory, allMessages } =
    userChatStore();
  const { socket } = userAuthStore();
  const navigate = useNavigate();
  const Logo = useColorModeValue(LogoBlack, LogoWhite);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isSendingMessage) return;

    const handleReceiveMessage = (args) => {
      const allMessages = userChatStore.getState().allMessages;
      const incomingMessageId = args.incomingMessageId;

      const findMessageToModify = allMessages.find(
        (message) => message.incomingMessageId === incomingMessageId
      );

      const text = findMessageToModify.text + args.text;

      const newMessage = {
        ...findMessageToModify,
        text,
      };

      userChatStore.setState({
        allMessages: [...allMessages, newMessage],
      });
      if (args.isFinished === true) {
        userChatStore.setState({ isSendingMessage: false });
      }
    };

    socket.on("receive-message-client", handleReceiveMessage);

    return () => {
      socket.off("receive-message-client", handleReceiveMessage);
    };
  }, [isSendingMessage, socket]);

  useEffect(() => {
    if (!isStartingChat) return;

    socket.on("receive-chat-client", (args) => {
      userChatStore.setState({
        allChatHistory: [...allChatHistory, args],
        isStartingChat: false,
        selectedChat: args,
      });
      navigate(`/m/${args._id}`);
    });

    return () => {
      socket.off("receive-chat-client");
    };
  }, [isStartingChat, allChatHistory, navigate, socket]);

  useEffect(() => {
    if (scrollRef.current && (isSendingMessage || isStartingChat)) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSendingMessage, isStartingChat]);

  if (isSendingMessage || isStartingChat)
    return (
      <Flex
        ref={scrollRef}
        gap="15px"
        pointerEvents="none"
        userSelect="none"
        p="10px"
        w="full"
        h="70px"
        mb="10px"
      >
        <Flex pos="relative" alignItems="center" justifyContent="center">
          <Image src={Logo} w="20px " />
          <Spinner size="xl" pos="absolute" />
        </Flex>
      </Flex>
    );

  return null;
};

export default IsGettingResponse;
