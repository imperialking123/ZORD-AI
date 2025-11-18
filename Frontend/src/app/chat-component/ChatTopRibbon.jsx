import { useColorModeValue } from "@/components/ui/color-mode";
import { Flex, Heading } from "@chakra-ui/react";

const ChatTopRibbon = () => {
  return (
    <Flex
      alignItems="center"
      userSelect="none"
      h="35px"
      justifyContent="space-between"
      pl="10px"
      pr="10px"
      minW="full"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.300", "gray.800")}
    >
      <Heading fontSize="md" fontFamily="zordTitle">
        ZORD
      </Heading>
    </Flex>
  );
};

export default ChatTopRibbon;
