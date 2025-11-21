import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import LogoBlack from "@/assets/LogoBlack.svg";
import LogoWhite from "@/assets/LogoWhite.svg";
import { useColorModeValue } from "@/components/ui/color-mode";
import { IoSearchOutline } from "react-icons/io5";
import ChatList from "./ChatList";
import ProfileButton from "@/components/ui/ProfileButton";
import { useNavigate } from "react-router-dom";
import userChatStore from "@/store/userChatStore";
import "@/assets/stylesheets/thinScrollbar.css";
import userAuthStore from "@/store/userAuthStore";
import { TbEdit } from "react-icons/tb";
import { BsReverseLayoutSidebarReverse } from "react-icons/bs";

const SideBarContainer = () => {
  const logoSRC = useColorModeValue(LogoBlack, LogoWhite);

  const logoHoverBG = useColorModeValue("gray.200", "gray.800");

  const navigate = useNavigate();

  const { isShowSideBar: isShowSideBarValue, showSearchPop } = userAuthStore();

  const handleNewChat = () => {
    userChatStore.setState({
      allMessages: [],
      isStartingChat: false,
      isSendingMessage: false,
      selectedChat: null,
    });
    userAuthStore.setState({ isShowSideBar: !isShowSideBarValue });
    navigate("/");
    speechSynthesis.cancel();
  };

  const handleChangeShowSideBar = () => {
    userAuthStore.setState({ isShowSideBar: !isShowSideBarValue });
  };

  const handleNavigateToGallery = () => {
    speechSynthesis.cancel();
    navigate("/gallery");
    userChatStore.setState({ selectedChat: null });
    userAuthStore.setState({ isShowSideBar: !isShowSideBarValue });
  };

  const handleToggleShowSearchPop = () => {
    userAuthStore.setState({ showSearchPop: !showSearchPop });
  };

  return (
    <Flex
      position={{
        base: "fixed",
        md: "relative",
        lg: "relative",
      }}
      top={{
        base: "0",
      }}
      bottom={{
        base: "0",
      }}
      zIndex={10}
      minW={{ base: "100%", md: "30%", lg: "20%" }}
      maxW={{ base: "100%", md: "30%", lg: "20%" }}
      left={{ base: isShowSideBarValue ? "0" : "-100%", lg: "0", md: "0" }}
      transition="0.5s ease"
      onClick={handleChangeShowSideBar}
    >
      <Flex
        borderRight="1px solid"
        borderColor={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
        minW="100%"
        maxH="100vh"
        p="10px"
        direction="column"
        bg={useColorModeValue("gray.50", "gray.950")}
        onClick={(e) => e.stopPropagation()}
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

          <IconButton
            variant="ghost"
            display={{
              base: "flex",
              lg: "none",
            }}
            onClick={handleChangeShowSideBar}
          >
            <BsReverseLayoutSidebarReverse />
          </IconButton>
        </Flex>

        <Flex gap="5px" mt="20px" mb="15px" direction="column">
          <Button
            rounded="md"
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            w="full"
            onClick={handleNewChat}
          >
            <Icon>
              <TbEdit />
            </Icon>
            <Text>New Chat</Text>
          </Button>

          <Button
            rounded="md"
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            w="full"
            onClick={handleToggleShowSearchPop}
          >
            <Icon>
              <IoSearchOutline />
            </Icon>
            <Text>Search chats</Text>
          </Button>

          {/* <Button
            rounded="md"
            justifyContent="flex-start"
            variant="ghost"
            size="sm"
            w="full"
            onClick={handleNavigateToGallery}
          >
            <Icon>
              <LuImages />
            </Icon>
            <Text>Gallery</Text>
          </Button> */}
        </Flex>

        <ChatList />

        <ProfileButton />
      </Flex>
    </Flex>
  );
};

export default SideBarContainer;
