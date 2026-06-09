import type { LanguageOption } from "./i18n.types";

export const getLanguageOptions = (): LanguageOption[] => [
  { locale: "en", code: "EN" },
  { locale: "he", code: "HE" },
];
