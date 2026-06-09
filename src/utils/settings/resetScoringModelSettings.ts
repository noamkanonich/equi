import { recommendedScoringWeights } from "@/data/scoring/scoring.mock";
import type { ScoringModelSettingsState } from "@/data/settings/settings.types";

export const resetScoringModelSettings = (): ScoringModelSettingsState => ({
  weights: { ...recommendedScoringWeights },
  isCustomModel: false,
});
