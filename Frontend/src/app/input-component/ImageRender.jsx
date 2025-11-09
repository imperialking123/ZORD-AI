import { Flex, Float, IconButton, Image } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";

const ImageRender = ({ ImageBase64, setImageBase64 }) => {
  return (
    <Flex
      pos="relative"
      maxW="100px"
      maxH="100px"
      minW="100px"
      bg="none"
      minH="100px"
      mt="10px"
      mb="10px"
    >
      <Float>
        <IconButton
          onClick={() => setImageBase64(null)}
          size="xs"
          fontSize="lg"
          rounded="full"
        >
          <LuX />
        </IconButton>
      </Float>

      <Image
        rounded="lg"
        minW="full"
        maxW="full"
        minH="full"
        maxH="full"
        alt="image"
        src={ImageBase64}
      />
    </Flex>
  );
};

export default ImageRender;
