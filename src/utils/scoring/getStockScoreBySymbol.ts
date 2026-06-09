import { getMockScoringInputBySymbol } from "@/data/scoring/scoring.mock";
import type { OverallScoreResult } from "@/data/scoring/scoring.types";
import { calculateOverallScore } from "./calculateOverallScore";

const FALLBACK_SCORE_RESULT: OverallScoreResult = {
  score: 60,
  status: "average",
  labelKey: "scoring.status.average",
  suggestedAction: "watch",
  confidence: "low",
  categoryScores: [],
  reasons: [],
  risks: ["scoring.risks.missingData"],
};

export const getStockScoreBySymbol = (symbol: string): OverallScoreResult => {
  const normalized = symbol.trim().toUpperCase();
  const mockInput = getMockScoringInputBySymbol(normalized);

  if (!mockInput) {
    return { ...FALLBACK_SCORE_RESULT };
  }

  return calculateOverallScore(mockInput);
};
