import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2a1b12",
        linen: "#f4eadc",
        porcelain: "#fffaf4",
        taupe: "#7f5c38",
        clay: "#8d613a",
        olive: "#8d613a",
        mist: "#ead4bd",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(32, 26, 23, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
