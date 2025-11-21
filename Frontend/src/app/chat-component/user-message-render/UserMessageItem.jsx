import { useColorModeValue } from "@/components/ui/color-mode";
import { Flex, IconButton, Text, useClipboard } from "@chakra-ui/react";
import { useState } from "react";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
const UserMessage = ({ messageData }) => {
  const [showOptions, setShowOptions] = useState(false);

  const selectBackgroundColor = useColorModeValue("blue.300", "gray.600");

  const handleToggleVisible = () => {
    setShowOptions(!showOptions);
  };

  const clipBoard = useClipboard({ value: messageData?.text || "" });

  return (
    <Flex
      onMouseEnter={handleToggleVisible}
      onMouseLeave={handleToggleVisible}
      w="full"
      direction="column"
      alignItems="flex-end"
      id={messageData?._id || ""}
    >
      <Flex
        maxW={{ base: "70%", md: "60%", lg: "55%" }}
        rounded="20px"
        _dark={{ bg: "gray.800" }}
        _light={{ bg: "gray.200" }}
        minH="20px"
        alignSelf="flex-end"
        p="10px"
        flexShrink={0}
        userSelect="text"
        position="relative"
      >
        {messageData?.text && (
          <Text _selection={{ bg: selectBackgroundColor }}>
            {messageData.text}
          </Text>
        )}
      </Flex>

      <Flex
        transition="opacity 0.5s"
        mt="5px"
        ml="5px"
        justifyContent="flex-end"
        w="full"
        visibility={showOptions ? "visible" : "hidden"}
        opacity={showOptions ? 1 : 0}
      >
        <IconButton
          onClick={() => clipBoard.copy()}
          variant="ghost"
          _hover={{
            bg: { _dark: "gray.800" },
          }}
          size="2xs"
        >
          {clipBoard.copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default UserMessage;
