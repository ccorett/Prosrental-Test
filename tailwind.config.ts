import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#07111a",
        background: "#0c151d",
        surface: {
          DEFAULT: "#0c151d",
          elevated: "#16222c",
        },
        border: "#1e2b36",
        muted: "#8ba8b5",
        foreground: "#ebfbff",
        accent: {
          DEFAULT: "#00c6ff",
          hover: "#33d1ff",
          muted: "rgb(0 198 255 / 0.12)",
        },
        secondary: {
          DEFAULT: "#6cc801",
          hover: "#88e631",
          muted: "rgb(108 200 1 / 0.12)",
        },
        tertiary: "#ffa329",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
