import { Button, Float, Icon, Image, Spinner, Tag } from "@chakra-ui/react";
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
    return;
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
      disabled={true}
      onClick={googleButtonClickHandler}
      size="xl"
      rounded="full"
      variant="surface"
      pos="relative"
    >
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <Image alt="google_logo" src={googleIcon} w="20px" />
          Continue with Google{" "}
        </>
      )}

      <Float offsetX="12">
        <Tag.Root rounded="full" variant="solid" size="sm" colorPalette="red">
          <Tag.Label>Coming Soon</Tag.Label>
        </Tag.Root>
      </Float>
    </Button>
  );
};

export default GoogleAuthButton;
