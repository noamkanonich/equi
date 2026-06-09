import type {
  AddStockQuickOverview,
  AddStockSearchResult,
} from "./add-stock.types";
import {
  ADD_STOCK_OPPORTUNITY_THRESHOLD,
  scoreThresholds,
} from "@/config/scoring.config";

export type AddStockTone = "positive" | "warning" | "negative";

/** Uses a higher positive threshold than standard score badges (see ADD_STOCK_OPPORTUNITY_THRESHOLD). */
export const mapAddStockScoreToTone = (score: number): AddStockTone => {
  if (score >= ADD_STOCK_OPPORTUNITY_THRESHOLD) return "positive";
  if (score >= scoreThresholds.watch) return "warning";
  return "negative";
};

export const mapAddStockChangeToTone = (changePercent: number): AddStockTone => {
  if (changePercent > 0) return "positive";
  if (changePercent < 0) return "negative";
  return "warning";
};

export const mapSearchResultToQuickOverview = (
  stock: AddStockSearchResult,
): AddStockQuickOverview => ({
  currentPrice: stock.price,
  marketCap: stock.marketCap,
  sector: stock.sector,
  industry: stock.industry,
  weekRangeLow: stock.weekRangeLow,
  weekRangeHigh: stock.weekRangeHigh,
  analystRating: stock.analystRating,
  analystRatingScore: stock.analystRatingScore,
  equiScore: stock.score,
  currency: stock.currency,
});
