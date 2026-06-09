import { scoreThresholds } from "@/config/scoring.config";
import type { SuggestedAction } from "@/data/scoring/scoring.types";

export const getSuggestedAction = (score: number): SuggestedAction => {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  if (normalized >= scoreThresholds.buyMore) return "buyMore";
  if (normalized >= scoreThresholds.hold) return "hold";
  if (normalized >= scoreThresholds.watch) return "watch";
  if (normalized >= scoreThresholds.reduce) return "reduce";
  return "avoid";
};
