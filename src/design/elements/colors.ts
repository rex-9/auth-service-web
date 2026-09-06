// src/design/elements/colors.ts

export const colors = {
  // Brand (Rex9 Neon Scarlet Red Palette - More Red, Less Pink)
  primary: "#FF2238",
  primaryLight: "#FF5263",
  primaryDark: "#CC1125",
  secondary: "#FF4D2E",
  accent: "#FF0D2D",

  // Neon Glow Colors
  glowWhite: "#FFF2F4",
  glowOuter: "#5C0916",

  // Shadow color tokens
  shadows: {
    blackXs: "rgba(0, 0, 0, 0.08)",
    blackSm: "rgba(0, 0, 0, 0.08)",
    blackMd: "rgba(0, 0, 0, 0.10)",
    glow: "rgba(255, 34, 56, 0.4)",
    glassCard: "rgba(255, 34, 56, 0.35)",
    glassHover: "rgba(255, 34, 56, 0.45)",
    textDark: "rgba(0, 0, 0, 0.9)",
  },

  // Semantic (Unified across Light & Dark themes)
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#38BDF8",
  },

  // Day Theme (Light Mode)
  day: {
    background: "#FAFAF8",
    surface: "#FFFFFF",
    card: "#F5F5F3",
    border: "#E5E7EB",
    divider: "#F3F4F6",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textMuted: "#9CA3AF",
  },

  // Night Theme (Dark Mode - Rich Rex9 Aesthetic with clear brick visibility)
  night: {
    background: "#160b11",
    surface: "#1f1018",
    card: "#26131e",
    border: "#3d1b28",
    divider: "#2c111c",
    textPrimary: "#FFFFFF",
    textSecondary: "#E2D4D8",
    textMuted: "#A39298",
  },

  // Rex9 Glassmorphism Tokens
  glass: {
    nav: "rgba(22, 7, 13, 0.75)",
    card: "rgba(35, 12, 20, 0.38)",
    cardHover: "rgba(50, 16, 28, 0.55)",
    form: "rgba(28, 8, 16, 0.65)",
    project: "rgba(18, 6, 12, 0.55)",
    projectHover: "rgba(22, 7, 15, 0.75)",
    border: "rgba(255, 34, 56, 0.22)",
    borderHover: "rgba(255, 34, 56, 0.55)",
    tag: "rgba(255, 34, 56, 0.65)",
    tagBg: "rgba(255, 34, 56, 0.08)",
    tagBgHover: "rgba(255, 34, 56, 0.28)",
  },

  // Centralized Glow & Text Shadow Effects
  effects: {
    heroSign:
      "0 0 0.6rem var(--color-glow-white), 0 0 1.5rem var(--color-primary), -0.2rem 0.1rem 1rem var(--color-primary), 0.2rem 0.1rem 1rem var(--color-primary), 0 -0.5rem 2rem var(--color-primary-dark), 0 0.5rem 3rem var(--color-primary-dark)",
    headingGlow:
      "0 0 0.6rem var(--color-glow-white), 0 0 1.5rem var(--color-primary), -0.2rem 0.1rem 1rem var(--color-primary), 0.2rem 0.1rem 1rem var(--color-primary), 0 -0.5rem 2rem var(--color-primary-dark), 0 0.5rem 3rem var(--color-primary-dark)",
    cardHeading:
      "0 0 6px var(--color-glow-white), 0 0 12px var(--color-primary), 0 0 18px var(--color-primary-dark)",
    navActive:
      "0 0 6px var(--color-glow-white), 0 0 12px var(--color-primary), 0 0 16px var(--color-primary-dark), 0 0 22px var(--color-glow-outer)",
    flickerFull:
      "-1px -1px 0px var(--color-glow-white), 1px 1px 0px var(--color-glow-white), 0 0 10px var(--color-glow-white), 0 0 20px var(--color-primary), 0 0 30px var(--color-primary), 0 0 40px var(--color-primary), 0 0 50px var(--color-primary-dark), 0 0 70px var(--color-primary-dark), 0 0 80px var(--color-glow-outer), 0 0 100px var(--color-glow-outer)",
  },
} as const;

export const BrandColors = {
  PRIMARY: "primary",
  PRIMARY_LIGHT: "primaryLight",
  PRIMARY_DARK: "primaryDark",
  SECONDARY: "secondary",
  ACCENT: "accent",
} as const;

export type BrandColorKey = (typeof BrandColors)[keyof typeof BrandColors];
export type SemanticColorKey = keyof typeof colors.semantic;
export type GlassTokenKey = keyof typeof colors.glass;
export type EffectTokenKey = keyof typeof colors.effects;
