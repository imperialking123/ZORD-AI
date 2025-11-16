import { CodeBlock, createShikiAdapter, Skeleton } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";

const CodeRender = ({ className, children, inline }) => {
  const [language, setLanguage] = useState("text");
  const [shikiAdapter, setShikiAdapter] = useState(null);
  const isShikiResolved = useRef(false);

  useEffect(() => {
    if (!className || className === null || className === undefined || inline)
      return;

    const match = /language-(\w+)/.exec(className);
    const lang = match ? match[1] : "text";

    setLanguage(lang);

    if (shikiAdapter || isShikiResolved.current) return;

    const initializeAdapter = async () => {
      const { createHighlighter } = await import("shiki");

      const adapter = createShikiAdapter({
        async load() {
          return createHighlighter({
            langs: [lang],
            themes: ["github-dark", "github-light"],
          });
        },
        theme: "github-light",
      });

      isShikiResolved.current = true;

      setShikiAdapter(adapter);
    };

    initializeAdapter();
    return () => {
      if (shikiAdapter && shikiAdapter.highlighter) {
        shikiAdapter.highlighter.dispose();
      }
    };
  }, [className, shikiAdapter, inline]);

  if (!shikiAdapter)
    return <Skeleton w="full" h="100px" variant="shine" rounded="md" />;

  if (inline) return <code className={className}>{children}</code>;

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
