import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";
import { mapOverallScoreResultToStockAnalysisOverlay } from "@/utils/scoring/mappers";

export const applyScoringToStockAnalysis = (
  stock: StockAnalysisData,
): StockAnalysisData => {
  const scoreResult = getStockScoreBySymbol(stock.symbol);
  const overlay = mapOverallScoreResultToStockAnalysisOverlay(
    scoreResult,
    stock.scoreBreakdown,
  );

  return {
    ...stock,
    ...overlay,
  };
};
