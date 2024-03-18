import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      // Overriding the default max-width of the container so I have the ability to use the full width of the screen
      screens: {
        sm: "1280px",
        md: "1280px",
        lg: "1280px",
        xl: "1280px",
        "2xl": "1496px",
      },
    },
    extend: {
      colors: {
        primary: "#334d62",
        "secondary-text": "#8ca0af",
        background: "#fcfcfd",
      },
      boxShadow: {
        "default-shadow": "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
