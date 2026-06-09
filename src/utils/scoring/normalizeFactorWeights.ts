import { scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type { ScoringFactorKey, ScoringFactorWeights } from "@/data/scoring/scoring.types";

const WEIGHT_STEP = 5;
const TOTAL_WEIGHT = 100;

const roundToStep = (value: number) =>
  Math.round(Math.max(0, Math.min(TOTAL_WEIGHT, value)) / WEIGHT_STEP) * WEIGHT_STEP;

export const getTotalWeight = (weights: ScoringFactorWeights): number =>
  scoringFactorKeys.reduce((sum, key) => sum + weights[key], 0);

export const normalizeFactorWeights = (
  weights: ScoringFactorWeights,
  changedKey: ScoringFactorKey,
  newWeight: number,
): ScoringFactorWeights => {
  const clamped = roundToStep(newWeight);
  const otherKeys = scoringFactorKeys.filter((key) => key !== changedKey);
  const remaining = TOTAL_WEIGHT - clamped;

  const otherSum = otherKeys.reduce((sum, key) => sum + weights[key], 0);

  const next: ScoringFactorWeights = { ...weights, [changedKey]: clamped };

  if (otherKeys.length === 0) {
    return next;
  }

  if (otherSum === 0) {
    const equalShare = roundToStep(remaining / otherKeys.length);
    otherKeys.forEach((key) => {
      next[key] = equalShare;
    });
  } else {
    let distributed = 0;
    otherKeys.forEach((key, index) => {
      if (index === otherKeys.length - 1) {
        next[key] = Math.max(0, remaining - distributed);
        return;
      }

      const proportion = weights[key] / otherSum;
      const share = roundToStep(remaining * proportion);
      next[key] = share;
      distributed += share;
    });
  }

  const drift = TOTAL_WEIGHT - getTotalWeight(next);
  if (drift !== 0) {
    const lastKey = otherKeys[otherKeys.length - 1];
    next[lastKey] = Math.max(0, next[lastKey] + drift);
  }

  return next;
};

export const areWeightsEqual = (
  a: ScoringFactorWeights,
  b: ScoringFactorWeights,
): boolean => scoringFactorKeys.every((key) => a[key] === b[key]);
