import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:        "#0f0e0c",
        cream:      "#f5f0e8",
        warm:       "#e8dfd0",
        gold: {
          DEFAULT: "#c9a84c",
          light:   "#e8c97a",
        },
        sage:       "#4a6355",
        rust:       "#8b4a2f",
        deep:       "#1a1814",
        muted:      "#7a7268",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display":    ["clamp(3rem, 7vw, 6rem)",    { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "headline":   ["clamp(2rem, 4vw, 3.5rem)",  { lineHeight: "1.1",  letterSpacing: "-0.015em" }],
        "title":      ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2" }],
        "body-lg":    ["clamp(1rem, 1.5vw, 1.2rem)", { lineHeight: "1.75" }],
      },
      spacing: {
        section: "clamp(5rem, 12vw, 10rem)",
      },
      animation: {
        "fade-in":   "fadeIn 0.8s ease-out forwards",
        "fade-up":   "fadeUp 0.9s ease-out forwards",
        "float":     "floatSlow 6s ease-in-out infinite",
        "pulse-dot": "pulseGold 2.5s ease-in-out infinite",
        "draw":      "drawLine 2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0.6)" },
          "50%":      { boxShadow: "0 0 0 10px rgba(201,168,76,0)" },
        },
        drawLine: {
          from: { strokeDashoffset: "1000" },
          to:   { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
