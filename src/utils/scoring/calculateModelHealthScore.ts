import { recommendedScoringWeights, scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type {
  ScoringFactorWeights,
  ScoringModelHealthLabelKey,
} from "@/data/scoring/scoring.types";

const HEALTH_SCALE = 2.5;

export const calculateModelHealthScore = (
  weights: ScoringFactorWeights,
  referenceWeights: ScoringFactorWeights = recommendedScoringWeights,
): number => {
  const averageDeviation =
    scoringFactorKeys.reduce(
      (sum, key) => sum + Math.abs(weights[key] - referenceWeights[key]),
      0,
    ) / scoringFactorKeys.length;

  return Math.max(0, Math.min(100, Math.round(100 - averageDeviation * HEALTH_SCALE)));
};

export const getModelHealthLabelKey = (healthScore: number): ScoringModelHealthLabelKey => {
  if (healthScore >= 85) return "veryStrong";
  if (healthScore >= 70) return "strong";
  if (healthScore >= 55) return "good";
  if (healthScore >= 40) return "watch";
  return "weak";
};
