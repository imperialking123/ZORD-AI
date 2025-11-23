import { Flex, Image } from "@chakra-ui/react";
import LogoBlack from "@/assets/LogoBlack.svg";
import LogoWhite from "@/assets/LogoWhite.svg";
import { useColorModeValue } from "../ui/color-mode";

export const GlowLogo = () => {
  const imageSrc = useColorModeValue(LogoBlack, LogoWhite);

  return (
    <Flex
      w="50px"
      h="50px"
      justify="center"
      userSelect="none"
      pointerEvents="none"
      align="center"
      position="relative"
    >
      <Image
        animation="swirl-filter 15s infinite linear"
        w="full"
        h="full"
        src={imageSrc}
        alt="Zord Logo"
        zIndex="2" // Ensures the logo is visible on top
      />
    </Flex>
  );
};
