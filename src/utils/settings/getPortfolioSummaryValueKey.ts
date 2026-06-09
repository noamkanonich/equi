import type {
  PortfolioSettingsState,
  PortfolioSummaryItemKey,
} from "@/data/settings/settings.types";

export const getPortfolioSummaryValueKey = (
  key: PortfolioSummaryItemKey,
  settings: PortfolioSettingsState,
): string => {
  switch (key) {
    case "riskProfile":
      return settings.riskProfile;
    case "targetAllocation":
      return settings.targetAllocation;
    case "benchmark":
      return settings.benchmark;
    case "maxSectorExposure":
      return String(settings.maxSectorExposure);
    case "maxSingleStockExposure":
      return String(settings.maxSingleStockExposure);
    case "rebalancingThreshold":
      return String(settings.rebalancingThreshold);
    default:
      return "";
  }
};

export const isPortfolioSummaryPercentKey = (
  key: PortfolioSummaryItemKey,
): boolean => {
  return (
    key === "maxSectorExposure" ||
    key === "maxSingleStockExposure" ||
    key === "rebalancingThreshold"
  );
};
