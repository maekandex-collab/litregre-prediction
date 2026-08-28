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
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22D366",
          600: "#16b355",
          700: "#129447",
          800: "#0f7639",
          900: "#0A1433",
          ink: "#0A1433",
          lime: "#7CFF30",
          green: "#22D366",
          light: "#F5F7FA",
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
          "0%, 100%": { boxShadow: "0 0 5px rgba(34, 211, 102, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(34, 211, 102, 0.55)" },
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
          primary: "#22D366",
          "primary-content": "#0A1433",
          secondary: "#0A1433",
          "secondary-content": "#F5F7FA",
          accent: "#7CFF30",
          "accent-content": "#0A1433",
          neutral: "#0A1433",
          "neutral-content": "#e8eef2",
          "base-100": "#F5F7FA",
          "base-200": "#e8ecf2",
          "base-300": "#d5dce6",
          "base-content": "#0A1433",
          info: "#0ea5e9",
          success: "#22D366",
          warning: "#d97706",
          error: "#dc2626",
        },
        eagledark: {
          primary: "#22D366",
          "primary-content": "#0A1433",
          secondary: "#7CFF30",
          "secondary-content": "#0A1433",
          accent: "#7CFF30",
          "accent-content": "#0A1433",
          neutral: "#121c3a",
          "neutral-content": "#f1f5f9",
          "base-100": "#0A1433",
          "base-200": "#101c40",
          "base-300": "#182652",
          "base-content": "#F5F7FA",
          info: "#38bdf8",
          success: "#22D366",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
    defaultTheme: "eaglelight",
  },
};

export default config;
