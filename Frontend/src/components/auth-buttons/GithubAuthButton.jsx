import githubIcon from "@/assets/icon/githubIcon.svg";
import userAuthStore from "@/store/userAuthStore";
import { getGithubState } from "@/utils/authFunction";
import { Button, Image, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const GithubAuthButton = () => {
  const [state, setState] = useState(null);

  const { isFetchingGithub } = userAuthStore();

  const handleClick = async () => {
    const stateToken = await getGithubState();
    if (stateToken) {
      setState(stateToken);
      localStorage.setItem("_zordAIgithubState", stateToken);
    }
  };

  useEffect(() => {
    const REDIRECT_URI = `${
      import.meta.env.VITE_FRONTEND_BASE_URL
    }/auth/github/callback`;

    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

    const url =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=read:user%20user:email` +
      `&state=${state}`;

    const continueLogin = () => {
      window.location.assign(url);
    };
    if (state) {
      continueLogin();
    }
  }, [state]);

  return (
    <Button variant="surface" onClick={handleClick} size="xl" rounded="full">
      {isFetchingGithub ? (
        <Spinner />
      ) : (
        <>
          <Image w="20px" src={githubIcon} alt="Github Logo" />
          Continue with Github{" "}
        </>
      )}
    </Button>
  );
};

export default GithubAuthButton;
