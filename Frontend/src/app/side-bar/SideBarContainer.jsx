import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import LogoBlack from "@/assets/LogoBlack.svg";
import LogoWhite from "@/assets/LogoWhite.svg";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FiSidebar } from "react-icons/fi";
import { RxPlusCircled } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { LuImages } from "react-icons/lu";
import ChatList from "./ChatList";
import ProfileButton from "@/components/ui/ProfileButton";
import { useNavigate } from "react-router-dom";
import userChatStore from "@/store/userChatStore";
import "@/assets/stylesheets/thinScrollbar.css";

const SideBarContainer = () => {
  const logoSRC = useColorModeValue(LogoBlack, LogoWhite);

  const logoHoverBG = useColorModeValue("gray.200", "gray.800");

  const navigate = useNavigate();

  const handleNewChat = () => {
    userChatStore.setState({
      allMessages: [],
      isStartingChat: false,
      isSendingMessage: false,
      selectedChat: null,
    });
    navigate("/");
  };

  return (
    <Flex
      borderRight="1px solid"
      borderColor={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
      minW="22%"
      maxH="100vh"
      p="10px"
      direction="column"
      bg={useColorModeValue("gray.50", "gray.950")}
    >
      <Flex
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        draggable={false}
        alignItems="center"
        justifyContent="space-between"
        w="full"
      >
        <Box
          w="30px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="5px"
          rounded="md"
          _hover={{
            bg: logoHoverBG,
          }}
        >
          <Image
            pointerEvents="none"
            userSelect="none"
            draggable="false"
            src={logoSRC}
            w="25px"
          />
        </Box>

        <Box
          w="30px"
          cursor="w-resize"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p="5px"
          rounded="md"
          _hover={{
            bg: logoHoverBG,
          }}
        >
          <Icon fontSize="20px">
            <FiSidebar />
          </Icon>
        </Box>
      </Flex>

      <Flex gap="5px" mt="20px" direction="column">
        <Button
          rounded="md"
          justifyContent="flex-start"
          variant="ghost"
          size="sm"
          w="full"
          onClick={handleNewChat}
        >
          <Icon>
            <RxPlusCircled />
          </Icon>
          <Text>New Chat</Text>
        </Button>

        <Button
          rounded="md"
          justifyContent="flex-start"
          variant="ghost"
          size="sm"
          w="full"
          onClick={() => userChatStore.setState({ showSearchPop: true })}
        >
          <Icon>
            <IoSearchOutline />
          </Icon>
          <Text>Search chats</Text>
        </Button>

        <Button
          rounded="md"
          justifyContent="flex-start"
          variant="ghost"
          size="sm"
          w="full"
        >
          <Icon>
            <LuImages />
          </Icon>
          <Text>Gallery</Text>
        </Button>
      </Flex>

      <ChatList />

      <ProfileButton />
    </Flex>
  );
};

export default SideBarContainer;
