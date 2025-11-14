import { Flex, Image, Spinner, Text } from "@chakra-ui/react";
import LogoBlack from "@/assets/LogoBlack.svg";
import LogoWhite from "@/assets/LogoWhite.svg";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useEffect } from "react";
import userChatStore from "@/store/userChatStore";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate } from "react-router-dom";

const IsGettingResponse = () => {
  const { isSendingMessage, isStartingChat, allChatHistory, allMessages } =
    userChatStore();
  const { socket } = userAuthStore();
  const navigate = useNavigate();
  const Logo = useColorModeValue(LogoBlack, LogoWhite);

  useEffect(() => {
    if (!isSendingMessage) return;
    socket.on("receive-message-client", (args) => {
      const updatedMessages = allMessages.map((message) => {
        if (
          message?.incomingMessageId &&
          message.incomingMessageId === args.incomingMessageId
        ) {
          const newMessage = {
            incomingMessageId: args.incomingMessageId,
            role: "model",
            text: (message.text += args.text),
          };

          return newMessage;
        } else {
          return message;
        }
      });
      userChatStore.setState({ allMessages: updatedMessages });

      if (args.isFinished === true) {
        userChatStore.setState({ isSendingMessage: false });
      }
    });

    return () => {
      socket.off("receive-message-client");
    };
  }, [isSendingMessage, allMessages, socket]);
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

  if (isSendingMessage || isStartingChat)
    return (
      <Flex
        gap="15px"
        pointerEvents="none"
        userSelect="none"
        p="10px"
        w="full"
        h="55px"
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
