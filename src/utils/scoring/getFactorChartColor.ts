import type { DefaultTheme } from "styled-components";
import type { ScoringFactorKey } from "@/data/scoring/scoring.types";

export const getFactorChartColor = (factor: ScoringFactorKey, theme: DefaultTheme): string => {
  const colors: Record<ScoringFactorKey, string> = {
    growth: theme.colors.status.positive,
    profitability: theme.colors.status.positive,
    valuation: theme.colors.status.warning,
    financialHealth: theme.colors.brand.primary,
    momentum: theme.colors.chart.purple,
    analystSentiment: theme.colors.chart.blue,
  };

  return colors[factor];
};
