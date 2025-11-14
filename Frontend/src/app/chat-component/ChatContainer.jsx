import { Flex, Text } from "@chakra-ui/react";
import ChatTopRibbon from "./ChatTopRibbon";
import InputContainer from "../input-component/InputContainer";
import ChatMapContainer from "./ChatMapContainer";
import breakPointStyles from "@/utils/breakPointsStyles";
import { useEffect } from "react";
import userAuthStore from "@/store/userAuthStore";
import { useNavigate } from "react-router-dom";

const ChatContainer = () => {
  const { authUser } = userAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }
  });

  return (
    <Flex w="full" h="100vh" direction="column">
      <ChatTopRibbon />

      <ChatMapContainer />

      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
        w="full"
        pl={breakPointStyles.inputContainerPL}
        pr={breakPointStyles.inputContainerPR}
      >
        <InputContainer />{" "}
        <Text mt="5px" mb="10px" color="fg.muted" fontSize="xs">
          ZORD AI can make mistakes. so cross check information
        </Text>
      </Flex>
    </Flex>
  );
};

export default ChatContainer;
