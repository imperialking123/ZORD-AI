import userChatStore from "@/store/userChatStore";
import { Flex, Icon, IconButton, Input, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { IoArrowForward } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import ImageRender from "./ImageRender";
import imageResizer from "@/utils/ImageResizer";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate } from "react-router-dom";

const InputContainer = () => {
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

  const handleSendMessage = () => {
    if (isSendingMessage || isStartingChat) return;
    if (isDisabled) return;

    if (!authUser) {
      userAuthStore.setState({ showLoginReminder: true });
      return;
    }

    const incomingMessageId = `${crypto.randomUUID().split("-")[0]}-${
      crypto.randomUUID().split("-")[0]
    }`;

    const messageArgs = {
      text: userInput.text,
      role: "user",
      incomingMessageId,
    };

    messageArgs.type =
      userInput.text.trim().length > 0 && !imageBase64 ? "text" : "image";

    if (imageBase64) {
      messageArgs.inlineData = userInput.inlineData;
    }

    const recentMessages = userChatStore.getState().allMessages;

    userChatStore.setState({
      allMessages: [...recentMessages, messageArgs],
      isStartingChat: true,
      isSendingMessage: true,
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
  };
  return (
    //Width should be full InputContainer must be container that will measure width
    <Flex
      _dark={{
        bg: "gray.800",
      }}
      direction="column"
      p="10px"
      minW="full"
      rounded="3xl"
      boxShadow="sm"
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
          size="lg"
          placeholder="Ask Zord anything"
          border="none"
          bg="none"
          _hover={{ bg: "none" }}
          _focus={{ bg: "none", boxShadow: "none", border: "none" }}
          _active={{ bg: "none", border: "none" }}
          outline="none"
        />
      </Flex>

      <Flex w="full" justifyContent="space-between">
        <IconButton
          onClick={() => inputRef.current.click()}
          rounded="full"
          variant="ghost"
        >
          <LuPlus />
          <Input onChange={handleOnchange} hidden ref={inputRef} type="file" />
        </IconButton>

        <IconButton
          disabled={isDisabled}
          onClick={handleSendMessage}
          rounded="full"
        >
          {isSendingMessage || isStartingChat ? (
            <Icon animation="spin">
              <BiLoaderCircle />
            </Icon>
          ) : (
            <IoArrowForward />
          )}
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default InputContainer;
