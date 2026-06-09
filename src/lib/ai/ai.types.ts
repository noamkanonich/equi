/**
 * Canonical AI types for Equi.
 * Re-exported from @/types/ai for backward compatibility.
 */

export type AiInsightType =
  | "portfolio"
  | "stock"
  | "smartReplace"
  | "chart"
  | "score";

export type AiConfidence = "low" | "medium" | "high";

/** Display labels for suggested actions (decision-support, not orders). */
export type AiSuggestedActionLabel =
  | "Buy More"
  | "Hold"
  | "Watch"
  | "Reduce"
  | "Avoid";

export interface AiInsight {
  id: string;
  type: AiInsightType;
  title: string;
  summary: string;
  positives: string[];
  risks: string[];
  suggestedAction: AiSuggestedActionLabel;
  confidence: AiConfidence;
  scoreExplanation?: string;
  whatChanged?: string[];
  dataFreshnessNote?: string;
  disclaimer: string;
  createdAt: string;
}

export interface AiPortfolioInsightInput {
  type: "portfolio";
  locale?: string;
  totalValue?: number;
  holdingCount?: number;
  topHoldings?: Array<{ symbol: string; weightPercent: number }>;
  periodChangePercent?: number;
}

export interface AiStockAnalysisInput {
  type: "stock";
  symbol: string;
  locale?: string;
  score?: number;
  suggestedAction?: AiSuggestedActionLabel;
  sector?: string;
}

export interface AiSmartReplaceInput {
  type: "smartReplace";
  currentSymbol: string;
  candidateSymbol: string;
  locale?: string;
  currentScore?: number;
  candidateScore?: number;
}

export interface AiChartExplanationInput {
  type: "chart";
  chartKind: string;
  symbol?: string;
  locale?: string;
  metricLabel?: string;
  periodLabel?: string;
}

export interface AiScoreExplanationInput {
  type: "score";
  symbol: string;
  locale?: string;
  score: number;
  suggestedAction: AiSuggestedActionLabel;
  categoryScores?: Record<string, number>;
}

export type AiGenerateInput =
  | AiPortfolioInsightInput
  | AiStockAnalysisInput
  | AiSmartReplaceInput
  | AiChartExplanationInput
  | AiScoreExplanationInput;

/** @deprecated Use AiGenerateInput */
export type AiAnalysisRequest = AiGenerateInput;
