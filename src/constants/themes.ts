export const themeOptions = ["light", "dark"] as const;

export type SupportedTheme = (typeof themeOptions)[number];
