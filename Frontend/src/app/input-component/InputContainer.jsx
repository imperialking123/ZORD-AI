import userChatStore from "@/store/userChatStore";
import {
  Flex,
  Icon,
  IconButton,
  Input,
  Menu,
  Portal,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuCamera, LuPlus, LuX } from "react-icons/lu";
import ImageRender from "./ImageRender";
import imageResizer from "@/utils/ImageResizer";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { TfiArrowUp } from "react-icons/tfi";
import { FaStop } from "react-icons/fa6";
import { IoMdAttach } from "react-icons/io";
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

  const handleAttachImage = async (event) => {
    const file = event.target.files[0];

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!file || !allowed.includes(file.type)) return;
    const thumbnail = await imageResizer(file, 200, 200, "WEBP", 0.8);
    const resized = await imageResizer(file, 1024, 1024, "WEBP", 0.85);

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
    if (isDisabled || isStartingChat || isSendingMessage) return;

    const incomingMessageId = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 12);

    if (!chatId) {
      const userMessageData = { ...userInput, role: "user" };
      const modelMessageToUpdate = {
        text: "",
        role: "model",
        incomingMessageId: incomingMessageId,
      };

      const allMessages = userChatStore.getState().allMessages;

      const resolvedMessages = [
        ...allMessages,
        userMessageData,
        modelMessageToUpdate,
      ];

      userChatStore.setState({
        isSendingMessage: true,
        isStartingChat: true,
        allMessages: resolvedMessages,
        selectedChat: "temp",
        incomingMessageId: incomingMessageId,
      });

      const messageData = {
        ...userMessageData,
        incomingMessageId: incomingMessageId,
      };

      setImageBase64(null);

      setUserInput({
        text: "",
        inlineData: { data: null, mimeType: "" },
      });

      socket.emit("start-chat-server", messageData);

      navigate(`/m/${incomingMessageId}`);
    } else {
      const userMessageData = { ...userInput, role: "user" };
      const modelMessageToUpdate = {
        text: "",
        role: "model",
        incomingMessageId: incomingMessageId,
      };

      const allMessages = userChatStore.getState().allMessages;
      const allChatHistory = userChatStore.getState().allChatHistory;

      const resolveChatHistory = allChatHistory.map((chat) => {
        if (chat._id === chatId) {
          const resolvedChat = {
            ...chat,
            lastActivity: new Date(),
          };

          return resolvedChat;
        } else {
          return chat;
        }
      });

      const resolvedMessages = [
        ...allMessages,
        userMessageData,
        modelMessageToUpdate,
      ];

      setImageBase64(null);

      setUserInput({
        text: "",
        inlineData: { data: null, mimeType: "" },
      });

      userChatStore.setState({
        allMessages: resolvedMessages,
        incomingMessageId: incomingMessageId,
        isSendingMessage: true,
        allChatHistory: resolveChatHistory,
      });

      const messageData = {
        ...userMessageData,
        chatId: chatId,
        incomingMessageId: incomingMessageId,
      };

      socket.emit("send-chat-server", messageData);
    }
  };

  return (
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
          size="xs"
          variant="outline"
        >
          <LuPlus />
          <Input
            onChange={handleAttachImage}
            hidden
            ref={inputRef}
            type="file"
          />
        </IconButton>

        <IconButton
          disabled={isDisabled}
          onClick={handleSendMessage}
          rounded="md"
          size="xs"
        >
          {isSendingMessage || isStartingChat ? (
            <Icon>
              <FaStop />
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
