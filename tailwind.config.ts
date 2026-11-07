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
        midnight: "#0f172a",
        ink: "#111827",
        accent: "#8b5cf6",
        glow: "#22d3ee",
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
