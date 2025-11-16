import userChatStore from "@/store/userChatStore";
import { Flex, Icon, IconButton, Input, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { LuPlus } from "react-icons/lu";
import ImageRender from "./ImageRender";
import imageResizer from "@/utils/ImageResizer";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { TfiArrowUp } from "react-icons/tfi";

const InputContainer = ({ width }) => {
  const { authUser, socket } = userAuthStore();
  const { isStartingChat, isSendingMessage } = userChatStore();
  const [imageBase64, setImageBase64] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    inlineData: {
      data: null,
      mimeType: null,
    },
    text: "",
  });
  const isDisabled =
    (userInput.text.trim().length === 0 && !imageBase64) ||
    isSendingMessage ||
    isStartingChat;

  const handleOnchange = async (event) => {
    const file = event.target.files[0];

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!file || !allowed.includes(file.type)) return;
    const thumbnail = await imageResizer(file, 200, 200, "JPEG", 0.8);
    const resized = await imageResizer(file, 1024, 1024, "JPEG", 0.85);

    setUserInput((prev) => ({
      ...prev,
      inlineData: {
        data: resized,
        mimeType: file.type,
      },
    }));

    setImageBase64(thumbnail);
  };

  const { chatId } = useParams();

  const handleSendMessage = () => {
    if (isDisabled) return;

    if (!authUser) {
      userAuthStore.setState({ showLoginReminder: true });
      return;
    }

    if (isSendingMessage || isStartingChat) return;

    userAuthStore.setState({ isStartingChat: true, isSendingMessage: true });
    const incomingMessageId = `${crypto.randomUUID().split("-")[0]}-${
      crypto.randomUUID().split("-")[0]
    }`;

    if (!chatId) {
      const messageArgs = {
        text: userInput.text,
        role: "user",
      };

      messageArgs.type =
        userInput.text.trim().length > 0 && !imageBase64 ? "text" : "image";

      if (imageBase64) {
        messageArgs.inlineData = userInput.inlineData;
      }

      const recentMessages = userChatStore.getState().allMessages;

      userChatStore.setState({
        allMessages: [...recentMessages, messageArgs],
        selectedChat: "temp",
        incomingMessageId: incomingMessageId,
      });

      setUserInput({
        inlineData: {
          data: null,
          mimeType: null,
        },
        text: "",
      });
      setImageBase64(null);

      socket.emit("start-chat-server", messageArgs);

      const random = `${crypto.randomUUID().split("-")[0]}-${
        crypto.randomUUID().split("-")[0]
      } `;

      navigate(`/m/${random}`);
    } else {
      const messageArgs = {
        text: userInput.text,
        role: "user",
        chatId: chatId,
      };

      messageArgs.type =
        userInput.text.trim().length > 0 && !imageBase64 ? "text" : "image";

      if (imageBase64) {
        messageArgs.inlineData = userInput.inlineData;
      }

      const recentMessages = userChatStore.getState().allMessages;

      userChatStore.setState({
        allMessages: [...recentMessages, messageArgs],
        isSendingMessage: true,
        incomingMessageId: incomingMessageId,
      });

      setUserInput({
        inlineData: {
          data: null,
          mimeType: null,
        },
        text: "",
      });
      setImageBase64(null);

      socket.emit("send-chat-server", messageArgs);

      const random = `${crypto.randomUUID().split("-")[0]}-${
        crypto.randomUUID().split("-")[0]
      } `;
    }
  };
  return (
    //Width should be full InputContainer must have container that will measure width
    <Flex
      _dark={{
        bg: "gray.800",
      }}
      direction="column"
      p="10px"
      minW={width || "full"}
      rounded="3xl"
      boxShadow="md"
    >
      {imageBase64 && (
        <ImageRender
          ImageBase64={imageBase64}
          setImageBase64={setImageBase64}
        />
      )}

      <Flex minW="full">
        <Textarea
          onChange={(event) => {
            setUserInput((prev) => ({ ...prev, text: event.target.value }));
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              handleSendMessage();
            }
          }}
          value={userInput.text}
          w="full"
          resize="none"
          autoresize
          maxH="5lh"
          size="md"
          fontSize="md"
          placeholder="Ask Zord"
          border="none"
          bg="none"
          _hover={{ bg: "none" }}
          _focus={{ bg: "none", boxShadow: "none", border: "none" }}
          _active={{ bg: "none", border: "none" }}
          outline="none"
        />
      </Flex>

      <Flex pl="10px" pr="10px" w="full" justifyContent="space-between">
        <IconButton
          onClick={() => inputRef.current.click()}
          rounded="md"
          variant="outline"
          size="sm"
        >
          <LuPlus />
          <Input onChange={handleOnchange} hidden ref={inputRef} type="file" />
        </IconButton>

        <IconButton
          disabled={isDisabled}
          onClick={handleSendMessage}
          rounded="md"
          size="xs"
        >
          {isSendingMessage || isStartingChat ? (
            <Icon animation="spin">
              <BiLoaderCircle />
            </Icon>
          ) : (
            <TfiArrowUp />
          )}
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default InputContainer;
