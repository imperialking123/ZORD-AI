import { Button, Icon, Image, Spinner } from "@chakra-ui/react";
import googleIcon from "@/assets/icon/googleIcon.png";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { getStateToken } from "@/utils/authFunction";
import userAuthStore from "@/store/userAuthStore";

const GoogleAuthButton = () => {
  const { isFetching } = userAuthStore();
  const redirect_uri = `${import.meta.env.VITE_FRONTEND_BASE_URL}/auth/google`;

  const [stateToken, setStateToken] = useState(null);

  const login = useGoogleLogin({
    ux_mode: "redirect",
    state: stateToken,
    flow: "auth-code",
    redirect_uri,
  });


  const googleButtonClickHandler = async () => {
    if (isFetching) return;

    const token = await getStateToken();

    if (token) {
      localStorage.setItem("_zordAIgoogleState", token);
      setStateToken(token);
    }
  };

  useEffect(() => {
    if (stateToken) {
      login();
    }
  }, [stateToken, login]);

  return (
    <Button
      disabled={isFetching}
      onClick={googleButtonClickHandler}
      size="xl"
      rounded="full"
      variant="surface"
    >
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <Image alt="google_logo" src={googleIcon} w="20px" />
          Continue with Google{" "}
        </>
      )}
    </Button>
  );
};

export default GoogleAuthButton;
