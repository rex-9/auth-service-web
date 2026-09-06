// tailwind.config.js
import { colors, font, radius, shadows, keyframes, animations } from './src/design/elements';
import daisyui from 'daisyui';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    daisyui,
    plugin(({ addBase }) => {
      addBase({
        ':root, [data-theme="day"]': {
          '--color-primary': colors.primary,
          '--color-primary-rgb': '255, 34, 56',
          '--color-primary-light': colors.primaryLight,
          '--color-primary-dark': colors.primaryDark,
          '--color-glow-white': colors.glowWhite,
          '--color-glow-outer': colors.glowOuter,
          '--color-glow-outer-rgb': '92, 9, 22',
          '--color-primary-content': colors.night.textPrimary,
          '--color-secondary': colors.secondary,
          '--color-secondary-content': colors.night.textPrimary,
          '--color-accent': colors.accent,
          '--color-accent-content': colors.night.textPrimary,
          '--color-base-100': colors.day.background,
          '--color-base-200': colors.day.surface,
          '--color-base-300': colors.day.card,
          '--color-base-content': colors.day.textPrimary,
          '--color-border': colors.day.border,
          '--color-divider': colors.day.divider,
          '--color-info': colors.semantic.info,
          '--color-success': colors.semantic.success,
          '--color-warning': colors.semantic.warning,
          '--color-error': colors.semantic.error,
        },
        '[data-theme="night"]': {
          '--color-primary': colors.primary,
          '--color-primary-rgb': '255, 34, 56',
          '--color-primary-light': colors.primaryLight,
          '--color-primary-dark': colors.primaryDark,
          '--color-glow-white': colors.glowWhite,
          '--color-glow-outer': colors.glowOuter,
          '--color-glow-outer-rgb': '92, 9, 22',
          '--color-primary-content': colors.night.textPrimary,
          '--color-secondary': colors.secondary,
          '--color-secondary-content': colors.night.textPrimary,
          '--color-accent': colors.accent,
          '--color-accent-content': colors.night.textPrimary,
          '--color-base-100': colors.night.background,
          '--color-base-200': colors.night.surface,
          '--color-base-300': colors.night.card,
          '--color-base-content': colors.night.textPrimary,
          '--color-border': colors.night.border,
          '--color-divider': colors.night.divider,
          '--color-info': colors.semantic.info,
          '--color-success': colors.semantic.success,
          '--color-warning': colors.semantic.warning,
          '--color-error': colors.semantic.error,
        },
      });
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.primary,
          light: colors.primaryLight,
          dark: colors.primaryDark,
        },
        secondary: colors.secondary,
        accent: colors.accent,
        glow: {
          white: colors.glowWhite,
          outer: colors.glowOuter,
        },
        glass: {
          nav: colors.glass.nav,
          card: colors.glass.card,
          'card-hover': colors.glass.cardHover,
          form: colors.glass.form,
          project: colors.glass.project,
          'project-hover': colors.glass.projectHover,
          border: colors.glass.border,
          'border-hover': colors.glass.borderHover,
          tag: colors.glass.tag,
          'tag-bg': colors.glass.tagBg,
          'tag-bg-hover': colors.glass.tagBgHover,
        },
      },
      fontFamily: font.fontFamily,
      fontWeight: font.fontWeight,
      fontSize: font.fontSize,
      borderRadius: radius,
      boxShadow: shadows,
      keyframes: keyframes,
      animation: animations,
    },
  },
  daisyui: {
    themes: [
      "day --default",
      "night --prefersdark",
    ],
    base: true,
    styled: true,
    utils: true,
  },
};