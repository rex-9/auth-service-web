/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#2563eb',
        },
        bg: {
          light: '#ffffff',
          dark: '#000000',
        },
        hover: {
          light: '#E5E7EB',
          dark: '#1f2937',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
          success: {
            light: '#10b981',
            dark: '#34d399',
          },
          warning: {
            light: '#f59e0b',
            dark: '#fbbf24',
          },
          error: {
            light: '#ef4444',
            dark: '#f87171',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
    },
  },
  plugins: [],
};
