import { Flex, IconButton, useClipboard } from "@chakra-ui/react";
import MarkdownRenderer from "./ui/MarkDownRenderer";
import {
  IoCheckmarkOutline,
  IoCopyOutline,
  IoStopCircle,
} from "react-icons/io5";
import { useState } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { cleanUpMarkdownText } from "@/utils/chatFunctions";

const AiMessageContainer = ({ messageData }) => {
  const clipBoard = useClipboard({ value: messageData?.text || "" });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeakText = () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      speechSynthesis.cancel();
      return;
    }

    const ttsText = cleanUpMarkdownText(messageData?.text);
    const utterance = new SpeechSynthesisUtterance(ttsText);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.lang = "en-US";
    utterance.rate = 1.2;
    utterance.pitch = 1.1;

    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  return (
    <Flex
      fontFamily="bodyText"
      direction="column"
      gap="10px"
      className="chat-message"
      opacity="0.98"
      id={messageData._id}
      
    >
      <MarkdownRenderer>
        {String(messageData.text).replace(/(\[.*?\])/g, "$1\n")}
      </MarkdownRenderer>

      {messageData.isFinished && (
        <Flex
          transition="opacity 0.5s"
          mt="5px"
          ml="5px"
          justifyContent="flex-start"
          w="full"
        >
          <IconButton
            onClick={() => clipBoard.copy()}
            variant="ghost"
            size="md"
          >
            {clipBoard.copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
          </IconButton>

          <IconButton onClick={handleSpeakText} variant="ghost" size="md">
            {isSpeaking ? <IoStopCircle /> : <HiOutlineSpeakerWave />}
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
};

export default AiMessageContainer;
