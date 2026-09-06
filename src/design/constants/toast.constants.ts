// src/design/constants/toast.constants.ts

/**
 * Rexone Design System - Toast & Alert Types
 */

export const ToastTypes = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type TToastType = (typeof ToastTypes)[keyof typeof ToastTypes];
