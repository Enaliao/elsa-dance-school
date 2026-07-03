import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        paper: "#fbfaf7",
        vermilion: "#b83224",
        jade: "#15745d",
        gold: "#b88725",
        plum: "#5c2849"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
        serif: ["Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(21, 21, 21, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
