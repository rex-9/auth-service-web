// src/design/constants/progress.constants.ts

/**
 * Rexone Design System - ProgressBar Constants & Types
 */

export const ProgressBarSizes = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type ProgressBarSize =
  (typeof ProgressBarSizes)[keyof typeof ProgressBarSizes];

export const ProgressBarVariants = {
  PRIMARY: "primary",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type ProgressBarVariant =
  (typeof ProgressBarVariants)[keyof typeof ProgressBarVariants];
