import MarkdownIt from "markdown-it";
import { useEffect } from "react";

const AiMessageContainer = ({ messageData }) => {
  const md = new MarkdownIt();

  const parser = md.parse(messageData.text);

  return null;
};

export default AiMessageContainer;
