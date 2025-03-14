/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",
          "primary-focus": "#2563eb",
          "secondary": "#e5e7eB",
          "secondary-focus": "#1f2937",
          "base-100": "#ffffff",
          "base-content": "#1f2937",
          "neutral-content": "#1f2937",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444"
        },
        dark: {
          "primary": "#2563eb",
          "primary-focus": "#3b82f6",
          "secondary": "#1f2937",
          "secondary-focus": "#e5e7eB",
          "base-100": "#1f2937",
          "base-content": "#ffffff",
          "neutral-content": "#000000",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171"
        }
      }
    ]
  },
};
