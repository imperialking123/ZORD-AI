import { Button, Flex, Heading, Image } from "@chakra-ui/react";
import LogoBlack from "@/assets/LogoBlack.svg";
import LogoWhite from "@/assets/LogoWhite.svg";
import { useColorModeValue } from "./color-mode";
import userAuthStore from "@/store/userAuthStore";

const TopRibbon = () => {
  const logoSRC = useColorModeValue(LogoBlack, LogoWhite);

  const handleShowSignupClick = () => {
    userAuthStore.setState({ showLoginReminder: true });
    return;
  };

  return (
    <Flex
      userSelect="none"
      pl="10px"
      pr="10px"
      alignItems="center"
      w="full"
      h="70px"
      pos="absolute"
      top="0"
      justifyContent="space-between"
    >
      <Flex alignItems="center" gap="10px">
        <Image src={logoSRC} w="35px" alt="ZORD Logo" />
        <Heading fontFamily="zordTitle">ZORD</Heading>
      </Flex>

      <Flex gap="10px">
        <Button
          fontFamily="zordTitle"
          onClick={handleShowSignupClick}
          rounded="full"
        >
          Login
        </Button>

        <Button
          onClick={handleShowSignupClick}
          display={{ base: "none", md: "flex", lg: "flex" }}
          variant="surface"
          rounded="full"
          fontFamily="zordTitle"
        >
          Signup for free
        </Button>
      </Flex>
    </Flex>
  );
};

export default TopRibbon;
