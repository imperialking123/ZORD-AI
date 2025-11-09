import { Box, Flex, Text } from "@chakra-ui/react";


const LineDividerText = ({ text }) => {
  return (
    <Flex opacity="85%" alignItems="center" gap="2" w="full">
      <Box flex="1" h="1px" bg="gray.300" />
      <Text fontSize="md">{text}</Text>
      <Box flex="1" h="1px" bg="gray.300" />
    </Flex>
  );
};

export default LineDividerText;
