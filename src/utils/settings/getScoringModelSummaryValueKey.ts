import { recommendedScoringWeights } from "@/data/scoring/scoring.mock";
import type { ScoringModelSettingsState } from "@/data/settings/settings.types";
import { areWeightsEqual } from "@/utils/scoring/normalizeFactorWeights";

export const getScoringModelSummaryValueKey = (
  settings: ScoringModelSettingsState,
): "custom" | "recommended" => {
  if (settings.isCustomModel) return "custom";
  if (areWeightsEqual(settings.weights, recommendedScoringWeights)) return "recommended";
  return "custom";
};
