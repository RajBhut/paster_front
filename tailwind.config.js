/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        // Single-purpose palette, not decorative
        surface: {
          0: "#ffffff",
          1: "#f7f7f5",
          2: "#efeeea",
          3: "#e6e4de",
        },
        ink: {
          DEFAULT: "#1a1a18",
          2: "#3d3d38",
          3: "#6b6b63",
          4: "#9b9a93",
          5: "#c5c4bc",
        },
        accent: {
          DEFAULT: "#1d6aff",
          hover: "#1559d4",
          subtle: "#e8f0ff",
        },
        danger: {
          DEFAULT: "#d93025",
          subtle: "#fce8e7",
        },
        success: {
          DEFAULT: "#1a7a42",
          subtle: "#e7f4ec",
        },
        warning: {
          DEFAULT: "#b45309",
          subtle: "#fef3c7",
        },
        border: "#e0dfd8",
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        focus: "0 0 0 3px rgb(29 106 255 / 0.2)",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [],
};
