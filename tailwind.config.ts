import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        surface: {
          DEFAULT: "#09090b",
          subtle: "#111114",
          card: "#141417",
          border: "#27272a",
          hover: "#1f1f23",
        },
        accent: {
          DEFAULT: "#ffffff",
          muted: "#a1a1aa",
          dark: "#52525b",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        widest: "0.15em",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 70%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};

export default config;
