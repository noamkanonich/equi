export const appConfig = {
  name: "Equi",
  supportedLocales: ["en", "he"] as const,
  defaultLocale: "en" as const,
} as const;

export type AppLocale = (typeof appConfig.supportedLocales)[number];
