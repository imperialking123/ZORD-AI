import userAuthStore from "@/store/userAuthStore";
import { Avatar, Flex, IconButton, Tag, Text } from "@chakra-ui/react";
import { FaGear } from "react-icons/fa6";
import { useColorModeValue } from "./color-mode";

const ProfileButton = () => {
  const { authUser } = userAuthStore();

  const bg = useColorModeValue("gray.200", "gray.900");

  return (
    <Flex
      alignItems="center"
      mt="10px"
      fontVariant="simplified"
      maxW="full"
      minH="40px"
      p="5px"
      gap="9px"
      bg={bg}
      rounded="lg"
    >
      <Avatar.Root size="xs">
        <Avatar.Fallback name={authUser.name} />
        <Avatar.Image src={authUser.profile?.avatar} />
      </Avatar.Root>

      <Flex
        flex="1"
        gap="0px"
        lineHeight="1.20"
        userSelect="none"
        direction="column"
      >
        <Text fontSize="sm" fontWeight="medium">
          {authUser.name}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          {authUser.appVersion || "Tunnel V.01"}
        </Text>
      </Flex>

      <Tag.Root size="lg"  rounded="full">
        <Tag.Label>Beta</Tag.Label>
      </Tag.Root>
    </Flex>
  );
};

export default ProfileButton;
