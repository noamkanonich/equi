import type {
  AiPreferencesState,
  AiPreferencesSummaryItemKey,
} from "@/data/settings/settings.types";

export const getAiPreferencesSummaryValueKey = (
  key: AiPreferencesSummaryItemKey,
  settings: AiPreferencesState,
): string => {
  if (key === "detailLevel") {
    return settings.detailLevel;
  }

  if (key === "tone") {
    return settings.tone;
  }

  if (key === "riskWarnings") {
    return settings.riskVisibility.showRiskWarnings ? "enabled" : "disabled";
  }

  if (key === "confidenceLevel") {
    return settings.riskVisibility.showConfidenceLevel ? "enabled" : "disabled";
  }

  if (key === "portfolioContext") {
    return settings.behavior.prioritizePortfolioContext ? "enabled" : "disabled";
  }

  return settings.enabledSections.dataFreshness ? "enabled" : "disabled";
};
