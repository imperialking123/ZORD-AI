import breakPointStyles from "@/utils/breakPointsStyles";
import { Flex } from "@chakra-ui/react";

const UserMessage = () => {
  return (
    <Flex
      maxW={{ base: "70%", md: "60%", lg: "55%" }}
      rounded="20px"
      bg="gray.700"
      minH="20px"
      alignSelf="flex-end"
      p="10px"
      draggable={false}
      onDrag={(e) => e.preventDefault()}
    >
      Hello what's going on bro any updates comone what's cooking hehe wetin dey
      xup my guy hope say you dey enjpoy oo
    </Flex>
  );
};

export default UserMessage;
