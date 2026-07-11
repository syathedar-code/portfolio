/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-raised": "var(--color-bg-raised)",
        "bg-panel": "var(--color-bg-panel)",
        amber: "var(--color-amber)",
        "amber-dim": "var(--color-amber-dim)",
        teal: "var(--color-teal)",
        "teal-dim": "var(--color-teal-dim)",
        danger: "var(--color-danger)",
        text: "var(--color-text)",
        "text-dim": "var(--color-text-dim)",
        "text-faint": "var(--color-text-faint)",
        line: "var(--color-line)",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "SF Mono", "monospace"],
        sans: ["Inter", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
