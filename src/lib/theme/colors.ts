type ColorScale = {
  app: string;
  card: string;
  soft: string;
  elevated: string;
};

type TextScale = {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
};

type BorderScale = {
  subtle: string;
  strong: string;
};

type BrandScale = {
  primary: string;
  primarySoft: string;
  primaryDark: string;
};

type StatusScale = {
  positive: string;
  positiveSoft: string;
  negative: string;
  negativeSoft: string;
  warning: string;
  warningSoft: string;
  neutral: string;
  neutralSoft: string;
};

type ChartScale = {
  blue: string;
  green: string;
  red: string;
  amber: string;
  purple: string;
  cyan: string;
  sparklineFill: {
    positive: string;
    negative: string;
    neutral: string;
    purple: string;
    amber: string;
  };
};

export type AppColors = {
  background: ColorScale;
  text: TextScale;
  border: BorderScale;
  brand: BrandScale;
  status: StatusScale;
  chart: ChartScale;
  scoreTier: {
    great: string;
    good: string;
    watch: string;
    avoid: string;
  };
  shadow: {
    card: string;
    soft: string;
  };
  overlay: {
    scrim: string;
  };
};

export const lightColors: AppColors = {
  background: {
    app: "#F6F8FB",
    card: "#FFFFFF",
    soft: "#EEF4FF",
    elevated: "#FFFFFF",
  },
  text: {
    primary: "#101828",
    secondary: "#667085",
    muted: "#98A2B3",
    inverse: "#FFFFFF",
  },
  border: {
    subtle: "#E4E7EC",
    strong: "#D0D5DD",
  },
  brand: {
    primary: "#2563EB",
    primarySoft: "#DBEAFE",
    primaryDark: "#1E40AF",
  },
  status: {
    positive: "#16A34A",
    positiveSoft: "#DCFCE7",
    negative: "#DC2626",
    negativeSoft: "#FEE2E2",
    warning: "#D97706",
    warningSoft: "#FEF3C7",
    neutral: "#64748B",
    neutralSoft: "#F1F5F9",
  },
  chart: {
    blue: "#2563EB",
    green: "#16A34A",
    red: "#DC2626",
    amber: "#D97706",
    purple: "#7C3AED",
    cyan: "#0891B2",
    sparklineFill: {
      positive: "#DCFCE7",
      negative: "#FEE2E2",
      neutral: "#F1F5F9",
      purple: "#EDE9FE",
      amber: "#FEF3C7",
    },
  },
  scoreTier: {
    great: "#16A34A",
    good: "#65A30D",
    watch: "#D97706",
    avoid: "#DC2626",
  },
  shadow: {
    card: "0 12px 32px rgba(16, 24, 40, 0.06)",
    soft: "0 8px 24px rgba(16, 24, 40, 0.05)",
  },
  overlay: {
    scrim: "rgba(16, 24, 40, 0.4)",
  },
};

export const darkColors: AppColors = {
  background: {
    app: "#0B0E14",
    card: "#151921",
    soft: "#1E293B",
    elevated: "#1A2030",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#94A3B8",
    muted: "#64748B",
    inverse: "#0B0E14",
  },
  border: {
    subtle: "#1E293B",
    strong: "#334155",
  },
  brand: {
    primary: "#3B82F6",
    primarySoft: "#1E3A5F",
    primaryDark: "#2563EB",
  },
  status: {
    positive: "#22C55E",
    positiveSoft: "#14532D",
    negative: "#EF4444",
    negativeSoft: "#450A0A",
    warning: "#F59E0B",
    warningSoft: "#451A03",
    neutral: "#94A3B8",
    neutralSoft: "#1E293B",
  },
  chart: {
    blue: "#3B82F6",
    green: "#22C55E",
    red: "#EF4444",
    amber: "#F59E0B",
    purple: "#A78BFA",
    cyan: "#22D3EE",
    sparklineFill: {
      positive: "#14532D",
      negative: "#450A0A",
      neutral: "#1E293B",
      purple: "#2E1065",
      amber: "#451A03",
    },
  },
  scoreTier: {
    great: "#22C55E",
    good: "#84CC16",
    watch: "#F59E0B",
    avoid: "#EF4444",
  },
  shadow: {
    card: "0 12px 32px rgba(0, 0, 0, 0.35)",
    soft: "0 8px 24px rgba(0, 0, 0, 0.25)",
  },
  overlay: {
    scrim: "rgba(0, 0, 0, 0.6)",
  },
};

/** @deprecated Use lightColors or createAppTheme("light").colors */
export const colors = lightColors;
