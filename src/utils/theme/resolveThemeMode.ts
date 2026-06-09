import type { ThemeOption } from "@/data/settings/settings.types";
import type { ThemeMode } from "@/lib/theme/theme";

export const getSystemThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const resolveEffectiveThemeMode = (theme: ThemeOption): ThemeMode => {
  if (theme === "system") {
    return getSystemThemeMode();
  }

  return theme;
};
