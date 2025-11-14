import { Flex } from "@chakra-ui/react";
import SideBarContainer from "./side-bar/SideBarContainer";
import { Outlet } from "react-router-dom";
import userAuthStore from "@/store/userAuthStore";
import { useEffect } from "react";
import { connnectSocket } from "@/utils/authFunction";

const AppContainer = () => {
  const { authUser, socket } = userAuthStore();

  useEffect(() => {
    if (authUser) {
      connnectSocket()
    }
  }, [authUser])

  useEffect(() => {

    if (!socket) return


    socket.on('connect_error', (err) => {
      return
    });

    return () => socket.off("connect_error")
  }, [socket])

  const text = ""


  return (
    <Flex  minW="full" minH="full">
      {authUser && <SideBarContainer />}

      <Outlet />
    </Flex>
  );
};

export default AppContainer;
