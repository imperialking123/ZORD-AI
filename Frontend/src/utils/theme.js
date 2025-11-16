import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        zordTitle: { value: "Orbitron, sans-serif " },
        bodyText: {
          value:
            " ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol ",
        },
      },
    },
  },
});

const theme = createSystem(defaultConfig, config);

export default theme;
