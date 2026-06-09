import type {
  AiPreferencesState,
  AlertSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
  SettingsSummaryItemKey,
} from "@/data/settings/settings.types";
import { getAiPreferencesSummaryValueKey } from "@/utils/settings/getAiPreferencesSummaryValue";
import { getEnabledAlertTypesCount } from "@/utils/settings/getEnabledAlertTypesCount";
import { getPortfolioSummaryValueKey } from "@/utils/settings/getPortfolioSummaryValueKey";
import { getScoringModelSummaryValueKey } from "@/utils/settings/getScoringModelSummaryValueKey";

type SettingsSummarySources = {
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
};

export const getSettingsSummaryDisplayKey = (
  key: SettingsSummaryItemKey,
  sources: SettingsSummarySources,
): string => {
  if (key === "riskProfile") {
    return getPortfolioSummaryValueKey("riskProfile", sources.portfolio);
  }

  if (key === "targetAllocation") {
    return getPortfolioSummaryValueKey("targetAllocation", sources.portfolio);
  }

  if (key === "scoringModel") {
    return getScoringModelSummaryValueKey(sources.scoringModel);
  }

  if (key === "alerts") {
    const count = getEnabledAlertTypesCount(sources.alerts);
    return count > 0 ? "enabled" : "disabled";
  }

  return getAiPreferencesSummaryValueKey("detailLevel", sources.aiPreferences);
};

export const getSettingsSummaryTabForKey = (
  key: SettingsSummaryItemKey,
): "portfolio" | "scoringModel" | "alerts" | "aiPreferences" => {
  if (key === "riskProfile" || key === "targetAllocation") {
    return "portfolio";
  }

  if (key === "scoringModel") {
    return "scoringModel";
  }

  if (key === "alerts") {
    return "alerts";
  }

  return "aiPreferences";
};
