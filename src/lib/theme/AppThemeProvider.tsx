"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { createAppTheme } from "@/lib/theme/theme";
import { useAppearanceStore } from "@/store/appearance.store";
import {
  getSystemThemeMode,
  resolveEffectiveThemeMode,
} from "@/utils/theme/resolveThemeMode";

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const themePreference = useAppearanceStore(
    (state) => state.appearanceSettings.theme,
  );
  const [systemMode, setSystemMode] = useState<"light" | "dark">(() =>
    getSystemThemeMode(),
  );

  useEffect(() => {
    if (themePreference !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemMode = () => {
      setSystemMode(mediaQuery.matches ? "dark" : "light");
    };

    updateSystemMode();
    mediaQuery.addEventListener("change", updateSystemMode);
    return () => mediaQuery.removeEventListener("change", updateSystemMode);
  }, [themePreference]);

  const effectiveMode = useMemo(() => {
    if (themePreference === "system") {
      return systemMode;
    }

    return resolveEffectiveThemeMode(themePreference);
  }, [systemMode, themePreference]);

  const appTheme = useMemo(
    () => createAppTheme(effectiveMode),
    [effectiveMode],
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = effectiveMode;
    document.documentElement.dataset.theme = effectiveMode;
  }, [effectiveMode]);

  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
};
