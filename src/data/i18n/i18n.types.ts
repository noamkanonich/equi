import type { AppLocale } from "@/config/app.config";

export type SupportedLocale = AppLocale;

export type LanguageOption = {
  locale: SupportedLocale;
  code: string;
};
