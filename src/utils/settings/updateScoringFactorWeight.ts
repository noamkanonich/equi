import type { ScoringFactorKey, ScoringFactorWeights } from "@/data/scoring/scoring.types";

const WEIGHT_STEP = 5;
const TOTAL_WEIGHT = 100;

const roundToStep = (value: number) =>
  Math.round(Math.max(0, Math.min(TOTAL_WEIGHT, value)) / WEIGHT_STEP) * WEIGHT_STEP;

export const updateScoringFactorWeight = (
  weights: ScoringFactorWeights,
  changedKey: ScoringFactorKey,
  newWeight: number,
): ScoringFactorWeights => ({
  ...weights,
  [changedKey]: roundToStep(newWeight),
});
