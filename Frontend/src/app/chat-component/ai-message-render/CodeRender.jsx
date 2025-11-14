import { CodeBlock, createShikiAdapter } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";

const CodeRender = ({ className, children }) => {
  const [language, setLanguage] = useState("text");

  const shikiAdapter = createShikiAdapter({
    async load() {
      // Dynamic import remains valid modern JS
      const { createHighlighter } = await import("shiki");
      return createHighlighter({
        langs: [language],
        themes: ["github-dark", "github-light"],
      });
    },
    theme: "github-light",
  });

  // const language = /language-(\w+)/.exec(className || "")[1]

  useEffect(() => {
    if (!className || className === null || className === undefined) return;

    console.log(className);
  }, [children]);

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <CodeBlock.Root language={language} code={children}>
        <CodeBlock.Header>
          <CodeBlock.Title></CodeBlock.Title>
        </CodeBlock.Header>

        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
};

export default memo(CodeRender);
