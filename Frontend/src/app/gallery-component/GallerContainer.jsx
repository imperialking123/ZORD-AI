import { Flex, Tabs, Text } from "@chakra-ui/react";
import UploadedImages from "./ui/UploadedImages";

const GallerContainer = () => {
  return (
    <Flex minH="full" w="full">
      <Tabs.Root w="full" defaultValue="images">
        <Tabs.List ml="10px">
          <Tabs.Trigger value="images">
            <Text>Images</Text>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="images">
          <UploadedImages />
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
};

export default GallerContainer;
