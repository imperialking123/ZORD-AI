import { GlowLogo } from "@/components/logo/Logo";
import userAuthStore from "@/store/userAuthStore";
import { handleDiscordAuth } from "@/utils/authFunction";
import { Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DiscordPageContainer = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const hasRunRef = useRef(false);


  const navigate = useNavigate();

  useEffect(() => {
    if (!hasRunRef.current) {
      hasRunRef.current = true;

      if (error) {
        userAuthStore.setState({
          showLoginReminder: true,
          showLoginReminderAuthError:
            "Could not get profile information from Discord. Try again",
        });
        navigate("/", { replace: true });
        return;
      }

      if (!code) {
        userAuthStore.setState({
          showLoginReminder: true,
          showLoginReminderAuthError:
            "Could not get profile information from Discord",
        });
        navigate("/", { replace: true });
        return;
      }

      const continueLoginFunc = async () => {
        const response = await handleDiscordAuth(code);

        if (response.isError) {
          userAuthStore.setState({
            showLoginReminderAuthError: response.message,
            showLoginReminder: true,
          });
          navigate("/", { replace: true });
        } else {
          userAuthStore.setState({
            showLoginReminder: false,
            showLoginReminderAuthError: null,
            authUser: response.data,
          });
          navigate("/", { replace: true });
        }
      };

      continueLoginFunc();
    }
  }, [code, error, navigate]);

  return (
    <Flex w="full" minH="full" justifyContent="center" alignItems="center">
      <GlowLogo />
    </Flex>
  );
};

export default DiscordPageContainer;
