import type {
  OverallScoreResult,
  ScoreFactorInput,
  ScoreStatus,
  StockScoringInput,
  SuggestedAction,
} from "@/data/scoring/scoring.types";
import type {
  ScoreLabelKey,
  StockScoreBreakdownItem,
} from "@/data/stocks/stock-analysis.types";
import { scoreThresholds } from "@/config/scoring.config";

export type ActionTone = "positive" | "neutral" | "warning" | "negative";

export const mapSuggestedActionToTone = (
  suggestedAction: SuggestedAction,
): ActionTone => {
  if (suggestedAction === "buyMore") return "positive";
  if (suggestedAction === "hold") return "neutral";
  if (suggestedAction === "watch") return "warning";
  return "negative";
};

export const mapScoreToBadgeTone = (
  score: number,
): "positive" | "warning" | "negative" => {
  if (score >= scoreThresholds.hold) return "positive";
  if (score >= scoreThresholds.watch) return "warning";
  return "negative";
};

export const mapScoreToTone = (score: number): ActionTone => {
  if (score >= scoreThresholds.hold) return "positive";
  if (score >= scoreThresholds.watch) return "warning";
  if (score >= scoreThresholds.reduce) return "negative";
  return "negative";
};

const STATUS_TO_STOCK_LABEL_KEY: Record<ScoreStatus, ScoreLabelKey> = {
  veryStrong: "veryStrong",
  strong: "strong",
  average: "good",
  weak: "watch",
  veryWeak: "weak",
};

export const mapScoreStatusToStockLabelKey = (status: ScoreStatus): ScoreLabelKey =>
  STATUS_TO_STOCK_LABEL_KEY[status];

export const mapStockScoringInputToCategoryInputs = (
  input: StockScoringInput,
): ScoreFactorInput[] => [
  { category: "growth", score: input.growthScore },
  { category: "profitability", score: input.profitabilityScore },
  { category: "valuation", score: input.valuationScore },
  { category: "financialHealth", score: input.financialHealthScore },
  { category: "momentum", score: input.momentumScore },
  { category: "analystSentiment", score: input.analystSentimentScore },
];

export type StockAnalysisScoreOverlay = {
  overallScore: number;
  scoreLabelKey: ScoreLabelKey;
  suggestedAction: SuggestedAction;
  confidenceLabelKey: "high" | "medium" | "low";
  scoreBreakdown: StockScoreBreakdownItem[];
};

export const mapOverallScoreResultToStockAnalysisOverlay = (
  result: OverallScoreResult,
  existingBreakdown: StockScoreBreakdownItem[] = [],
): StockAnalysisScoreOverlay => {
  const breakdownByCategory = new Map(
    existingBreakdown.map((item) => [item.category, item]),
  );

  const scoreBreakdown = result.categoryScores.map((categoryResult) => {
    const existing = breakdownByCategory.get(categoryResult.category);

    return {
      category: categoryResult.category,
      score: categoryResult.score,
      labelKey: mapScoreStatusToStockLabelKey(categoryResult.status),
      sparkline: existing?.sparkline ?? [categoryResult.score],
    };
  });

  return {
    overallScore: result.score,
    scoreLabelKey: mapScoreStatusToStockLabelKey(result.status),
    suggestedAction: result.suggestedAction,
    confidenceLabelKey: result.confidence,
    scoreBreakdown,
  };
};

