import type { AppTheme } from "@/lib/theme/theme";
import type { DashboardScoreDistributionKey } from "@/data/dashboard/dashboard.types";

export const SCORE_TIER_ORDER: DashboardScoreDistributionKey[] = [
  "great",
  "good",
  "watch",
  "avoid",
];

export const getScoreTierColor = (
  key: DashboardScoreDistributionKey,
  theme: AppTheme,
) => theme.colors.scoreTier[key];

export const getScoreTierColors = (theme: AppTheme) =>
  SCORE_TIER_ORDER.map((key) => getScoreTierColor(key, theme));
