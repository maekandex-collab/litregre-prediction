import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Segoe UI", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          ink: "#071a1f",
          lime: "#a3e635",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
        shimmer: "shimmer 2s infinite linear",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.4s ease-out both",
        "slide-in-left": "slideInLeft 0.4s ease-out both",
        "count-up": "countUp 0.6s ease-out both",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin 4s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        eaglelight: {
          primary: "#0f766e",
          "primary-content": "#ecfdf5",
          secondary: "#ca8a04",
          "secondary-content": "#422006",
          accent: "#a3e635",
          "accent-content": "#14532d",
          neutral: "#0f1c24",
          "neutral-content": "#e8eef2",
          "base-100": "#f4f7f6",
          "base-200": "#e7eeec",
          "base-300": "#d5e0dd",
          "base-content": "#0c1a1f",
          info: "#0ea5e9",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
        },
        eagledark: {
          primary: "#2dd4bf",
          "primary-content": "#042f2e",
          secondary: "#fbbf24",
          "secondary-content": "#422006",
          accent: "#a3e635",
          "accent-content": "#14532d",
          neutral: "#1e293b",
          "neutral-content": "#f1f5f9",
          "base-100": "#071a1f",
          "base-200": "#0d2a30",
          "base-300": "#164047",
          "base-content": "#ecfdf5",
          info: "#38bdf8",
          success: "#4ade80",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
    defaultTheme: "eaglelight",
  },
};

export default config;
