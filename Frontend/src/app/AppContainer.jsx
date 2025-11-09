import { Flex } from "@chakra-ui/react";
import SideBarContainer from "./side-bar/SideBarContainer";
import { Outlet } from "react-router-dom";
import userAuthStore from "@/store/userAuthStore";

const AppContainer = () => {
  const { authUser } = userAuthStore();
  return (
    <Flex minW="full" minH="full">
      {authUser && <SideBarContainer />}

      <Outlet />
    </Flex>
  );
};

export default AppContainer;
