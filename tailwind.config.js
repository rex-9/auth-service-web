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
          // "base-100": "#ffffff",
          // "base-content": "#000000",
          "secondary": "#e5e7eB",
          "secondary-focus": "#1f2937",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444"
        },
        dark: {
          "primary": "#2563eb",
          "primary-focus": "#3b82f6",
          // "base-100": "#000000",
          // "base-content": "#ffffff",
          "secondary": "#1f2937",
          "secondary-focus": "#e5e7eB",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171"
        }
      }
    ]
  },
};
