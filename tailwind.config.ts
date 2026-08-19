import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: "#010d20",
          card: "#071a33",
        },
        cyan: {
          accent: "#00e5ff",
        },
        blue: {
          accent: "#246bff",
        },
      },
      fontFamily: {
        display: ["var(--font-nunito)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
