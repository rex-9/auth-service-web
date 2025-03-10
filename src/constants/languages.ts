export const languages = [
  { value: "en", label: "🇺🇸 English" },
  { value: "es", label: "🇪🇸 Español" },
] as const;

export type SupportedLanguage = (typeof languages)[number]["value"];
