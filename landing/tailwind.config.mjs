/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Paleta CREDIEXPRESS
        azul: {
          DEFAULT: "#1E90FF",
          dark: "#0066CC",
          light: "#63B3FF",
        },
        verde: {
          DEFAULT: "#00C853",
          dark: "#009624",
          light: "#5EFC82",
        },
        turquesa: {
          DEFAULT: "#00B4D8",
          dark: "#0096B7",
          light: "#48CAE4",
        },
        cyan: {
          DEFAULT: "#0096C7",
          dark: "#023E8A",
          light: "#90E0EF",
        },
        negro: {
          DEFAULT: "#1A1A2E",
          soft: "#2D2D44",
        },
        gris: {
          claro: "#F7F8FA",
          medio: "#E8EDF2",
          texto: "#4A5568",
        },
      },
      fontFamily: {
        // Tipografía distintiva: DM Sans para texto, Syne para títulos
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
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
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
