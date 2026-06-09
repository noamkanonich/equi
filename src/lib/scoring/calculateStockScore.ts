import { scoringWeights } from "@/config/scoring.config";
import type { StockScore } from "@/types/scoring";
import { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";

export const calculateStockScore = (symbol: string): StockScore => {
  const result = getStockScoreBySymbol(symbol);

  const breakdown = result.categoryScores.map((categoryResult) => ({
    category: categoryResult.category,
    score: categoryResult.score,
    weight: scoringWeights[categoryResult.category],
  }));

  return {
    symbol: symbol.trim().toUpperCase(),
    overallScore: result.score,
    suggestedAction: result.suggestedAction,
    breakdown,
  };
};
