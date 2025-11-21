import { useColorModeValue } from "@/components/ui/color-mode";
import userAuthStore from "@/store/userAuthStore";
import { Flex, Heading, IconButton } from "@chakra-ui/react";
import { TbMenu3 } from "react-icons/tb";

const ChatTopRibbon = () => {
  const handleChangeShowSideBar = () => {
    const isShowSideBar = userAuthStore.getState().isShowSideBar;
    userAuthStore.setState({ isShowSideBar: !isShowSideBar });
  };


  return (
    <Flex
      alignItems="center"
      userSelect="none"
      h="45px"
      pl="5px"
      pr="5px"
      minW="full"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.300", "gray.800")}
    >
      <IconButton
        onClick={handleChangeShowSideBar}
        display={{
          base: "flex",
          md: "flex",
          lg: "none",
        }}
        variant="plain"
        size="md"
        fontWeight="bolder"
      >
        <TbMenu3 />
      </IconButton>

      <Heading fontSize="md" fontFamily="zordTitle">
        ZORD
      </Heading>
    </Flex>
  );
};

export default ChatTopRibbon;
