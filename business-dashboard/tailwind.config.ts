import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0c0e",
        panel: "#15171b",
        edge: "#22262c",
        muted: "#7a8190",
        accent: "#5eead4",
      },
    },
  },
  plugins: [],
};

export default config;
