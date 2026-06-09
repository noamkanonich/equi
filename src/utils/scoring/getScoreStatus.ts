import type { ScoreStatus } from "@/data/scoring/scoring.types";
import { scoreThresholds } from "@/config/scoring.config";

/** Score status tiers — breakpoints match scoreThresholds in scoring.config.ts */
export const getScoreStatus = (score: number): ScoreStatus => {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  if (normalized >= scoreThresholds.buyMore) return "veryStrong";
  if (normalized >= scoreThresholds.hold) return "strong";
  if (normalized >= scoreThresholds.watch) return "average";
  if (normalized >= scoreThresholds.reduce) return "weak";
  return "veryWeak";
};
