import GoogleAuthButton from "@/components/auth-buttons/GoogleAuthButton";
import { useColorModeValue } from "@/components/ui/color-mode";
import userAuthStore from "@/store/userAuthStore";
import breakPointStyles from "@/utils/breakPointsStyles";
import {
  Alert,
  Flex,
  Float,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { LuX } from "react-icons/lu";
import DiscordAuthButton from "@/components/auth-buttons/DiscordAuthButton";
import GithubAuthButton from "@/components/auth-buttons/GithubAuthButton";

const RequestLogin = () => {
  const [show, setShow] = useState(true);
  const { showLoginReminderAuthError } = userAuthStore();

  const Container = Motion.div;

  const bg = useColorModeValue("white", "gray.900");

  const handleCloseClick = () => {
    setShow(false);
  };

  const handleExitComplete = () => {
    userAuthStore.setState({
      isFetching: false,
      showLoginReminder: false,
      showLoginReminderAuthError: null,
    });
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <Container
          onClick={() => setShow(false)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(20px)",
            zIndex: 9999,
          }}
        >
          <Flex
            onClick={(e) => e.stopPropagation()}
            w={breakPointStyles.RequestLoginWidth}
            rounded={breakPointStyles.RequestLoginRounded}
            h={breakPointStyles.RequestLoginHeight}
            overflowY="scroll"
            bg={bg}
            padding="15px 10px"
            userSelect="none"
            direction="column"
            alignItems="center"
            pos="relative"
            zIndex="5"
            gap="20px"
            boxShadow="sm"
          >
            <Float zIndex="10" offset="6">
              <IconButton
                onClick={handleCloseClick}
                rounded="full"
                variant="ghost"
                size="sm"
              >
                <LuX />
              </IconButton>
            </Float>

            <Heading mt="20px" fontSize="2xl">
              Welcome. Let's Get Started
            </Heading>
            <Text w="90%" textAlign="center">
              You'll get personalized responses and progressed saved
            </Text>

            {showLoginReminderAuthError !== null &&
              showLoginReminderAuthError !== "" && (
                <Alert.Root variant="subtle" status="error">
                  <Alert.Indicator />
                  <Alert.Title>{showLoginReminderAuthError}</Alert.Title>
                </Alert.Root>
              )}

            <Flex
              gap="20px"
              minW="full"
              direction="column"
              alignContent="center"
            >
              <GoogleAuthButton />
              <DiscordAuthButton />
              <GithubAuthButton />

              {/* <LineDividerText text="OR" />

              <AuthFormContainer /> */}
            </Flex>
          </Flex>
        </Container>
      )}
    </AnimatePresence>
  );
};

export default RequestLogin;
