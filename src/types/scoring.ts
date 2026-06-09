export type { SuggestedAction } from "@/data/scoring/scoring.types";

import type { SuggestedAction } from "@/data/scoring/scoring.types";

export interface ScoreBreakdown {
  category: string;
  score: number;
  weight: number;
}

export interface StockScore {
  symbol: string;
  overallScore: number;
  suggestedAction: SuggestedAction;
  breakdown: ScoreBreakdown[];
}
