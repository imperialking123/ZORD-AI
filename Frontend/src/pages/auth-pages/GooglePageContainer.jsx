import { GlowLogo } from "@/components/logo/Logo";
import userAuthStore from "@/store/userAuthStore";
import { handleGoogleAuth } from "@/utils/authFunction";
import { Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GooglePageContainer = () => {
  const [searchParams] = useSearchParams();
  const hasRun = useRef(null);
  const navigate = useNavigate();

  const localState = localStorage.getItem("_zordAIgoogleState");

  const error = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      if (error) {
        localStorage.removeItem("_zordAIgoogleState");
        userAuthStore.setState({
          showLoginReminder: true,
          showLoginReminderAuthError:
            "Couldn't grab your Google info. Try again.",
        });
        navigate("/", { replace: true });
        return;
      }

      if (!localState || !state || !code || state !== localState) {
        userAuthStore.setState({
          showLoginReminder: false,
          showLoginReminderAuthError: null,
        });
        navigate("/", { replace: true });
        return;
      }
      const continueLoginFunc = async () => {
        const postArgs = { state, code };

        const response = await handleGoogleAuth(postArgs);
        if (response.isError) {
          userAuthStore.setState({
            showLoginReminder: true,
            showLoginReminderAuthError: response.message,
          });
          navigate("/", { replace: true });
        } else {
          userAuthStore.setState({
            showLoginReminder: false,
            authUser: response.data,
            showLoginReminderAuthError: null,
          });
          navigate("/", { replace: true });
        }
      };

      continueLoginFunc();
    }
  }, [error, localState, navigate, state, code]);

  return (
    <Flex w="full" minH="full" justifyContent="center" alignItems="center">
      <GlowLogo />
    </Flex>
  );
};

export default GooglePageContainer;
