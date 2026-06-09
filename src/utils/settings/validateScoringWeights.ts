import type { ScoringFactorWeights } from "@/data/scoring/scoring.types";
import type { ScoringModelValidation } from "@/data/settings/settings.types";
import { getScoringTotalWeight } from "./getScoringTotalWeight";

export const validateScoringWeights = (
  weights: ScoringFactorWeights,
): ScoringModelValidation => {
  const total = getScoringTotalWeight(weights);

  return {
    total,
    isValid: total === 100,
  };
};
