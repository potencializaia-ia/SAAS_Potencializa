import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        potencializa: {
          orange:     "#ff851b",
          "orange-dark": "#e0700d",
          cyan:       "#7fdbff",
          "cyan-dark": "#4cc9f5",
          navy:       "#001f3f",
          "navy-light": "#003366",
        },
      },
      fontFamily: {
        sans:    ["Raleway", "sans-serif"],
        heading: ['"Source Sans 3"', "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #001f3f 0%, #003366 50%, #001f3f 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(0,31,63,0.95) 0%, rgba(0,51,102,0.95) 100%)",
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease-in-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
