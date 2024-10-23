import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "#5A6A70",
        secondary: "#b89d81",
        tertiary: "#83B4C5",
        alert: "#e74c3c",
        "orange-light": "#F0B678",
        "yellow-light": "#F3E89E",
        "sky-blue": "#55D2FF",
        "mint-green": "#0CF8BF",
        magenta: "#C83DAF",
        "dark-red": "#CB0C4E",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
