import { recommendedScoringWeights } from "@/data/scoring/scoring.mock";
import type { ScoringFactorKey } from "@/data/scoring/scoring.types";

export const scoringWeights = Object.fromEntries(
  (Object.entries(recommendedScoringWeights) as [ScoringFactorKey, number][]).map(
    ([key, percent]) => [key, percent / 100],
  ),
) as Record<ScoringFactorKey, number>;

export const scoreThresholds = {
  buyMore: 85,
  hold: 70,
  watch: 55,
  reduce: 40,
} as const;

/** Add-stock opportunity badge uses a slightly higher positive threshold than hold. */
export const ADD_STOCK_OPPORTUNITY_THRESHOLD = 75;
