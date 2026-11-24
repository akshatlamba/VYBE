import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        brand: {
          lime: "#D3E57A",
          limeHover: "#c4d869",
          lilac: "#D9C9F5",
          peach: "#FAD8C6",
          pink: "#F6C9DD",
          coral: "#F6C9DD",
          sky: "#BAE6FD",
          darkBg: "#0D0D12",
          glassCard: "rgba(28, 28, 34, 0.82)",
          glassBorder: "rgba(255, 255, 255, 0.12)",
        },
        vybe: {
          peach: "#FAD8C6",
          pink: "#F6C9DD",
          lilac: "#D9C9F5",
          lime: "#D3E57A",
          ink: "#1E1E22",
          charcoal: "#26262B",
          darkBg: "#0C0C0F",
          info: "#2F6BFF",
          success: "#5BAE75",
          warning: "#E7A23C",
          danger: "#E0605E",
          surface: "var(--color-surface)",
          card: "var(--color-card)",
          border: "var(--color-border)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
        },
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "24px",
        "28": "28px",
        xl: "32px",
        pill: "9999px",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        caption: ["12px", { lineHeight: "16px" }],
        small: ["14px", { lineHeight: "20px" }],
        body: ["16px", { lineHeight: "24px" }],
        h3: ["20px", { lineHeight: "28px" }],
        h2: ["26px", { lineHeight: "34px" }],
        h1: ["36px", { lineHeight: "44px" }],
        display: ["44px", { lineHeight: "50px" }],
      },
      boxShadow: {
        "glow-lime": "0 0 25px -4px rgba(211, 229, 122, 0.35)",
        "glow-lilac": "0 0 20px -3px rgba(217, 201, 245, 0.3)",
        "glow-peach": "0 0 25px -4px rgba(250, 216, 198, 0.35)",
        "glass-card": "0 25px 60px -15px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08) inset",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.7)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)",
        "feature-dark": "0 14px 34px -8px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
        soft: "0 4px 20px -2px rgba(28, 28, 34, 0.05)",
      },
      backdropBlur: {
        glass: "20px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
