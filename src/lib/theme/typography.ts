export const typography = {
  fontFamily: {
    primary:
      "'Inter', 'Assistant', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    hebrew: "'Assistant', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xxl: "1.5rem",
    pageTitle: "2rem",
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  preset: {
    pageTitle: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    cardTitle: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.4,
    },
    tableText: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    brandWordmark: {
      fontSize: "1.125rem",
      fontWeight: 500,
      letterSpacing: "0.28em",
      lineHeight: 1,
    },
  },
} as const;

export type AppTypography = typeof typography;
