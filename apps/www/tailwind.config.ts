import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "mona-sans": ["Mona Sans", ...fontFamily.sans],
        "hubot-sans": ["Hubot Sans", ...fontFamily.mono],
      },
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        ds: {
          gray: {
            100: "var(--ds-gray-100)",
            200: "var(--ds-gray-200)",
            300: "var(--ds-gray-300)",
            400: "var(--ds-gray-400)",
            500: "var(--ds-gray-500)",
            600: "var(--ds-gray-600)",
            700: "var(--ds-gray-700)",
            800: "var(--ds-gray-800)",
            900: "var(--ds-gray-900)",
            1000: "var(--ds-gray-1000)",
          },
          blue: {
            100: "var(--ds-blue-100)",
            200: "var(--ds-blue-200)",
            300: "var(--ds-blue-300)",
            400: "var(--ds-blue-400)",
            500: "var(--ds-blue-500)",
            600: "var(--ds-blue-600)",
            700: "var(--ds-blue-700)",
            800: "var(--ds-blue-800)",
            900: "var(--ds-blue-900)",
            1000: "var(--ds-blue-1000)",
          },
          red: {
            100: "var(--ds-red-100)",
            200: "var(--ds-red-200)",
            300: "var(--ds-red-300)",
            400: "var(--ds-red-400)",
            500: "var(--ds-red-500)",
            600: "var(--ds-red-600)",
            700: "var(--ds-red-700)",
            800: "var(--ds-red-800)",
            900: "var(--ds-red-900)",
            1000: "var(--ds-red-1000)",
          },
          amber: {
            100: "var(--ds-amber-100)",
            200: "var(--ds-amber-200)",
            300: "var(--ds-amber-300)",
            400: "var(--ds-amber-400)",
            500: "var(--ds-amber-500)",
            600: "var(--ds-amber-600)",
            700: "var(--ds-amber-700)",
            800: "var(--ds-amber-800)",
            900: "var(--ds-amber-900)",
            1000: "var(--ds-amber-1000)",
          },
          green: {
            100: "var(--ds-green-100)",
            200: "var(--ds-green-200)",
            300: "var(--ds-green-300)",
            400: "var(--ds-green-400)",
            500: "var(--ds-green-500)",
            600: "var(--ds-green-600)",
            700: "var(--ds-green-700)",
            800: "var(--ds-green-800)",
            900: "var(--ds-green-900)",
            1000: "var(--ds-green-1000)",
          },
          teal: {
            100: "var(--ds-teal-100)",
            200: "var(--ds-teal-200)",
            300: "var(--ds-teal-300)",
            400: "var(--ds-teal-400)",
            500: "var(--ds-teal-500)",
            600: "var(--ds-teal-600)",
            700: "var(--ds-teal-700)",
            800: "var(--ds-teal-800)",
            900: "var(--ds-teal-900)",
            1000: "var(--ds-teal-1000)",
          },
          purple: {
            100: "var(--ds-purple-100)",
            200: "var(--ds-purple-200)",
            300: "var(--ds-purple-300)",
            400: "var(--ds-purple-400)",
            500: "var(--ds-purple-500)",
            600: "var(--ds-purple-600)",
            700: "var(--ds-purple-700)",
            800: "var(--ds-purple-800)",
            900: "var(--ds-purple-900)",
            1000: "var(--ds-purple-1000)",
          },
          pink: {
            100: "var(--ds-pink-100)",
            200: "var(--ds-pink-200)",
            300: "var(--ds-pink-300)",
            400: "var(--ds-pink-400)",
            500: "var(--ds-pink-500)",
            600: "var(--ds-pink-600)",
            700: "var(--ds-pink-700)",
            800: "var(--ds-pink-800)",
            900: "var(--ds-pink-900)",
            1000: "var(--ds-pink-1000)",
          },
          background: {
            100: "var(--ds-background-100)",
            200: "var(--ds-background-200)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      backgroundImage: {
        skeleton: "linear-gradient(270deg, #111, #333, #333, #111)",
        spinner: `conic-gradient(
          from 90deg at 50% 50%,
          rgba(39, 174, 96, 0) 0deg,
          rgba(31, 144, 255, 0) 0.04deg,
          #1f90ff 360deg
        )`,
      },
      keyframes: {
        skeleton: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "loading-dots": {
          "0%": {
            opacity: "0.2",
          },
          "20%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0.2",
          },
        },
        "spinner-spin": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0.15",
          },
        },
      },
      animation: {
        skeleton: "skeleton 8s infinite ease-in-out",
        rotate: "rotate 1s linear infinite",
        dots: "loading-dots 1.4s infinite",
        spinner: "spinner-spin 1.2s infinite linear",
      },
    },
  },
};

export default config;
