import type { ScoringFactorWeights } from "@/data/scoring/scoring.types";
import { getTotalWeight } from "@/utils/scoring/normalizeFactorWeights";

export const getScoringTotalWeight = (weights: ScoringFactorWeights): number =>
  getTotalWeight(weights);
