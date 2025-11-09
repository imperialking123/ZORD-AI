import discordSvg from "@/assets/icon/discordIcon.svg";
import { Button, Image } from "@chakra-ui/react";

const DiscordAuthButton = () => {
  const VITE_DISCORD_REDIRECT_URL = import.meta.env.VITE_DISCORD_REDIRECT_URL;
  const discordButtonClickHandler = () => {
    window.location.assign(VITE_DISCORD_REDIRECT_URL);
  };

  return (
    <Button variant="surface" onClick={discordButtonClickHandler} size="xl" rounded="full">
      <>
        <Image w="20px" src={discordSvg} alt="Discord Logo" />
        Continue with Discord{" "}
      </>
    </Button>
  );
};

export default DiscordAuthButton;
