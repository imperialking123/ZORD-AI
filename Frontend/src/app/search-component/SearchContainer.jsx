import { useColorModeValue } from "@/components/ui/color-mode";
import userAuthStore from "@/store/userAuthStore";
import userChatStore from "@/store/userChatStore";
import { searchChatWithText } from "@/utils/chatFunctions";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Separator,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import debounce from "lodash.debounce";
import { AnimatePresence, motion as Motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import { LuX } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "@/assets/stylesheets/thinScrollbar.css";

const SearchContainer = () => {
  const [show, setShow] = useState(true);

  const handleToggleShowSearchPop = () => {
    userAuthStore.setState({ showSearchPop: false });
  };

  const bg = useColorModeValue("white", "gray.900");

  const navigate = useNavigate();

  const handleNewChat = () => {
    userChatStore.setState({
      allMessages: [],
      isStartingChat: false,
      isSendingMessage: false,
      selectedChat: null,
    });
    setShow(false);
    navigate("/");
    speechSynthesis.cancel();
  };

  const { allChatHistory, isSearchingMessages } = userChatStore();

  const now = new Date();

  const recentChats = useMemo(() => {
    return [...allChatHistory].sort(
      (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
    );
  }, [allChatHistory]);

  // Boundaries
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).getTime();
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    0,
    0,
    0,
    0
  ).getTime();
  const sevenDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7,
    0,
    0,
    0,
    0
  ).getTime();

  const todaysChat = [];
  const yesterdaysChat = [];
  const lastSevenDaysChat = [];

  recentChats.forEach((chat) => {
    const t = new Date(chat.lastActivity).getTime();
    if (t >= startOfToday) {
      todaysChat.push(chat);
    } else if (t >= startOfYesterday && t < startOfToday) {
      yesterdaysChat.push(chat);
    } else if (t >= sevenDaysAgo && t < startOfYesterday) {
      lastSevenDaysChat.push(chat);
    }
  });

  const navigateToChat = (chatId) => {
    const chatData = allChatHistory.find((chat) => chat._id === chatId);
    speechSynthesis.cancel();
    document.title = chatData.title;
    userChatStore.setState({
      selectedChat: chatData,
      allMessages: [],
      isStartingChat: false,
      isSendingMessage: false,
    });
    userAuthStore.setState({ isShowSideBar: false, showSearchPop: false });
    speechSynthesis.cancel();
    navigate(`/m/${chatData._id.toString()}`);
  };

  const [searchResults, setSearchResults] = useState([]);

  const whiteSpaceRegEx = /\s{10,}/g;

  const debounceFunction = useCallback(
    debounce(async (text) => {
      const searchData = await searchChatWithText(text);
      if (!searchData) {
        setSearchResults([]);
        return;
      } else {
        setSearchResults([...searchData]);
      }
    }, 500),
    []
  );

  const handleOnchange = (event) => {
    const { value } = event.target;

    if (value === "") {
      setSearchResults(null);
      return;
    }

    // ignore input that is basically just huge whitespace
    if (whiteSpaceRegEx.test(value)) {
      return;
    }

    debounceFunction(value);
  };

  const handleNavigateToSearchedMessage = (chatId, messageId) => {
    userChatStore.setState({
      allMessages: [],
      isSearchingMessages: false,
      isSendingMessage: false,
      scrollTo: messageId.toString(),
    });
    setShow(false);
    navigate(`/m/${chatId}`);
  };

  return (
    <AnimatePresence onExitComplete={handleToggleShowSearchPop}>
      {show && (
        <Motion.div
          onClick={() => setShow(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(20px)",
            zIndex: 9999,
          }}
        >
          <Flex
            bg={bg}
            boxShadow="md"
            rounded={{ base: "0px ", md: "none", lg: "xl" }}
            onClick={(e) => e.stopPropagation()}
            minW={{ base: "100%", md: "45%", lg: "45%" }}
            maxW={{ base: "100%", md: "45%", lg: "45%" }}
            p="10px"
            direction="column"
            minH={{
              base: "100%",
              md: "65%",
              lg: "65%",
            }}
          >
            <InputGroup
              endElement={
                <IconButton
                  onClick={() => setShow(false)}
                  variant="outline"
                  rounded="full"
                  size="xs"
                >
                  <LuX />
                </IconButton>
              }
            >
              <Input
                onChange={handleOnchange}
                size="xl"
                variant="flushed"
                placeholder="Search chats"
              />
            </InputGroup>

            <Separator />

            {!isSearchingMessages && searchResults.length < 1 && (
              <Flex gap="10px" w="full" direction="column" mt="10px">
                <Button
                  onClick={handleNewChat}
                  rounded="lg"
                  justifyContent="flex-start"
                  variant="subtle"
                >
                  {" "}
                  <TbEdit /> New Chat
                </Button>

                {todaysChat.length > 0 && (
                  <Flex gap="10px" w="full" direction="column">
                    <Text fontSize="xs" ml="10px" userSelect="none">
                      Today
                    </Text>

                    {todaysChat
                      .slice(0, yesterdaysChat.length < 1 ? 2 : 1)
                      .map((chat, index) => (
                        <Button
                          key={chat._id || index}
                          onClick={() => navigateToChat(chat._id)}
                          rounded="lg"
                          justifyContent="flex-start"
                          variant="subtle"
                        >
                          <HiOutlineChatBubbleOvalLeft />{" "}
                          <Text>{chat.title || "New Chat"}</Text>
                        </Button>
                      ))}
                  </Flex>
                )}

                {yesterdaysChat.length > 0 && (
                  <Flex gap="10px" w="full" direction="column">
                    <Text fontSize="xs" ml="10px" userSelect="none">
                      Yesterday
                    </Text>

                    {yesterdaysChat.slice(0, 2).map((chat, index) => (
                      <Button
                        key={chat._id || index}
                        onClick={() => navigateToChat(chat._id)}
                        rounded="lg"
                        justifyContent="flex-start"
                        variant="subtle"
                      >
                        <HiOutlineChatBubbleOvalLeft />{" "}
                        <Text>{chat.title || "New Chat"}</Text>
                      </Button>
                    ))}
                  </Flex>
                )}

                {lastSevenDaysChat.length > 0 && (
                  <Flex gap="10px" w="full" direction="column">
                    <Text fontSize="xs" ml="10px" userSelect="none">
                      Last seven Days
                    </Text>

                    {lastSevenDaysChat.slice(0, 2).map((chat, index) => (
                      <Button
                        key={chat._id || index}
                        onClick={() => navigateToChat(chat._id)}
                        rounded="lg"
                        justifyContent="flex-start"
                        variant="subtle"
                      >
                        <HiOutlineChatBubbleOvalLeft />{" "}
                        <Text>{chat.title || "New Chat"}</Text>
                      </Button>
                    ))}
                  </Flex>
                )}
              </Flex>
            )}

            {isSearchingMessages && (
              <Flex
                mt="5"
                direction="column"
                w="full"
                h="full"
                gap="10"
                p="10px"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <HStack key={index} gap="1">
                    <SkeletonCircle size="4" />
                    <Stack flex="1">
                      <Skeleton height="2" width="60" />
                      <Skeleton height="2" width="60%" />
                    </Stack>
                  </HStack>
                ))}
              </Flex>
            )}

            {!isSearchingMessages && searchResults.length > 0 && (
              <Flex mt="5" direction="column" w="full" h="full" gap="2">
                {searchResults.map((result, index) => (
                  <Button
                    rounded="lg"
                    size="2xl"
                    justifyContent="flex-start"
                    variant="subtle"
                    key={result._id || index}
                    className="searchButton"
                    onClick={() =>
                      handleNavigateToSearchedMessage(
                        result.chatId._id,
                        result._id
                      )
                    }
                  >
                    <HiOutlineChatBubbleOvalLeft />
                    <Flex
                      direction="column"
                      justifyContent="flex-start"
                      w="90%"
                      fontSize="sm"
                      textAlign="left"
                    >
                      <Text w="full">{result.chatId?.title}</Text>
                      <Text
                        dangerouslySetInnerHTML={{ __html: result.text }}
                      ></Text>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            )}
          </Flex>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchContainer;
