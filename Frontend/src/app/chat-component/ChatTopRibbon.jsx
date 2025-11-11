import { Flex, Heading, IconButton, Menu } from "@chakra-ui/react"
import { AiFillDelete } from "react-icons/ai"


const ChatTopRibbon = () => {
    return (
        <Flex alignItems="center" userSelect="none" h="35px" justifyContent="space-between" pl="10px" pr="10px" minW="full" >
            <Heading fontSize="md" fontFamily="zordTitle" >ZORD</Heading>


            <IconButton variant="ghost" size="xs" colorPalette="red" >
                <AiFillDelete />
            </IconButton>
        </Flex>
    )
}

export default ChatTopRibbon