import { Flex, Text } from "@chakra-ui/react";

const UserMessage = ({ messageData }) => {
  return (
    <Flex
      maxW={{ base: "70%", md: "60%", lg: "55%" }}
      rounded="20px"
      bg="gray.700"
      minH="20px"
      alignSelf="flex-end"
      p="10px"
      flexShrink={0}
      userSelect="text"
    >
      {messageData?.text && (
        <Text
          _selection={{
            bg: "blue.600",
          }}
        >
          {messageData.text}
        </Text>
      )}
    </Flex>
  );
};

export default UserMessage;
