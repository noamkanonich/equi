export type ScoringFactorKey =
  | "growth"
  | "profitability"
  | "valuation"
  | "financialHealth"
  | "momentum"
  | "analystSentiment";

export type ScoringFactorImpact = "high" | "medium" | "low";

export type ScoringFactorAccent = "positive" | "primary" | "warning" | "purple";

export type ScoringFactorWeights = Record<ScoringFactorKey, number>;

export type ScoringFactorMeta = {
  key: ScoringFactorKey;
  impact: ScoringFactorImpact;
  accent: ScoringFactorAccent;
};

export type ScoringModelHealthLabelKey =
  | "veryStrong"
  | "strong"
  | "good"
  | "watch"
  | "weak";

export type ScoreCategory = ScoringFactorKey;

export type ScoreStatus =
  | "veryStrong"
  | "strong"
  | "average"
  | "weak"
  | "veryWeak";

export type ScoreConfidence = "high" | "medium" | "low";

export type SuggestedAction =
  | "buyMore"
  | "hold"
  | "watch"
  | "reduce"
  | "avoid";

export type ScoringWeights = Record<ScoreCategory, number>;

export type ScoreFactorInput = {
  category: ScoreCategory;
  score: number;
};

export type ScoringReason =
  | "scoring.reasons.strongGrowth"
  | "scoring.reasons.strongProfitability"
  | "scoring.reasons.healthyBalanceSheet"
  | "scoring.reasons.positiveMomentum"
  | "scoring.reasons.strongAnalystSentiment"
  | "scoring.reasons.attractiveValuation";

export type ScoringRisk =
  | "scoring.risks.weakGrowth"
  | "scoring.risks.lowProfitability"
  | "scoring.risks.stretchedValuation"
  | "scoring.risks.weakFinancialHealth"
  | "scoring.risks.negativeMomentum"
  | "scoring.risks.weakAnalystSentiment"
  | "scoring.risks.missingData";

export type CategoryScoreResult = {
  category: ScoreCategory;
  score: number;
  status: ScoreStatus;
  labelKey: string;
  reasons: ScoringReason[];
  risks: ScoringRisk[];
  confidence: ScoreConfidence;
};

export type OverallScoreResult = {
  score: number;
  status: ScoreStatus;
  labelKey: string;
  suggestedAction: SuggestedAction;
  confidence: ScoreConfidence;
  categoryScores: CategoryScoreResult[];
  reasons: ScoringReason[];
  risks: ScoringRisk[];
};

export type StockScoringInput = {
  symbol: string;
  companyName: string;
  growthScore: number;
  profitabilityScore: number;
  valuationScore: number;
  financialHealthScore: number;
  momentumScore: number;
  analystSentimentScore: number;
};
