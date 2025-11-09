import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        zordTitle: { value: "Orbitron, sans-serif " },
      },
    },
  },
});

const theme = createSystem(defaultConfig, config);

export default theme;
