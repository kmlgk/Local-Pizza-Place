/**
 * Local Pizza Place — Tailwind CDN configuration (single source of truth).
 * Loaded before `tailwind.config = window.stacklyTailwindConfig;` runs.
 */
window.stacklyTailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
        dark: "rgb(var(--color-dark) / <alpha-value>)",
        surface: "rgb(var(--bg-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--bg-surface-2) / <alpha-value>)",
        body: "rgb(var(--bg-body) / <alpha-value>)",
        ink: "rgb(var(--text-body) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        border: "rgb(var(--border-color) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgb(15 23 42 / 0.12)",
        elevated: "0 24px 48px -12px rgb(15 23 42 / 0.25)",
        glow: "0 0 40px -8px rgb(234 88 12 / 0.45)",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        fadeIn: "fadeIn .6s ease-out both",
      },
    },
  },
};
