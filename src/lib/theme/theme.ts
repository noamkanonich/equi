import { darkColors, lightColors } from "./colors";
import { typography } from "./typography";

export type ThemeMode = "light" | "dark";

const baseTheme = {
  typography,
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  breakpoints: {
    tablet: 768,
    desktop: 1024,
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  layout: {
    sidebarWidth: "15rem",
    sidebarWidthMin: "12.5rem",
    sidebarWidthMax: "18.5rem",
    sidebarWidthNarrow: "4.5rem",
    topBarHeight: "4rem",
    pageMaxWidth: "92rem",
    pageGap: "1.5rem",
    pageGapDense: "1rem",
    pagePaddingBlockEnd: "2rem",
    sidebarColumn: "minmax(18rem, 21rem)",
    mainSplitWide: "minmax(0, 1.75fr) minmax(18rem, 0.85fr)",
  },
  chartHeights: {
    sm: "8rem",
    md: "12rem",
    lg: "16rem",
  },
  zIndex: {
    overlay: 30,
    sidebar: 40,
    bottomSheet: 50,
    modal: 60,
    dropdown: 70,
  },
} as const;

export const createAppTheme = (mode: ThemeMode) => ({
  ...baseTheme,
  colors: mode === "dark" ? darkColors : lightColors,
});

export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");

/** @deprecated Use createAppTheme or lightTheme */
export const theme = lightTheme;

export type AppTheme = ReturnType<typeof createAppTheme>;

export { darkColors, lightColors, typography };
