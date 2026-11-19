import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6D28D9",
        },
        action: {
          DEFAULT: "#16A34A",
          hover: "#15803D",
        },
        ink: "#0F172A",
        body: "#475569",
        surface: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-jakarta)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 16px 40px -16px rgba(15,23,42,0.14)",
        cta: "0 1px 2px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
