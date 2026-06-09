import { scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type { ScoringWeights } from "@/data/scoring/scoring.types";

export const normalizeScoringWeights = (weights: ScoringWeights): ScoringWeights => {
  const total = scoringFactorKeys.reduce((sum, key) => sum + weights[key], 0);

  if (total === 0 || total === 100) {
    return { ...weights };
  }

  const normalized = {} as ScoringWeights;
  let distributed = 0;

  scoringFactorKeys.forEach((key, index) => {
    if (index === scoringFactorKeys.length - 1) {
      normalized[key] = Math.max(0, 100 - distributed);
      return;
    }

    const share = Math.round((weights[key] / total) * 100);
    normalized[key] = share;
    distributed += share;
  });

  return normalized;
};
