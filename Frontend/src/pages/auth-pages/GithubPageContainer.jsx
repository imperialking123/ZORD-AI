import { GlowLogo } from "@/components/logo/Logo";
import userAuthStore from "@/store/userAuthStore";
import { handleGithubAuth } from "@/utils/authFunction";
import { Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GithubPageContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");
      const localState = localStorage.getItem("_zordAIgithubState");

      // Handle error from GitHub
      if (error) {
        userAuthStore.setState({
          showLoginReminder: true,
          showLoginReminderAuthError:
            "Couldn't grab your GitHub info, please try again",
        });
        navigate("/", { replace: true });
        return;
      }

      // Validate state and code
      if (!localState || !state || !code || state !== localState) {
        userAuthStore.setState({
          showLoginReminder: false,
          showLoginReminderAuthError: null,
        });
        navigate("/", { replace: true });
        return;
      }

      // Continue login flow
      const continueLoginFunc = async () => {
        const postArgs = { state, code };
        const response = await handleGithubAuth(postArgs);

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
  }, [searchParams, navigate]);

  return (
    <Flex w="full" minH="full" justifyContent="center" alignItems="center">
      <GlowLogo />
    </Flex>
  );
};

export default GithubPageContainer;
