import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SuggestedAction } from "@/data/scoring/scoring.types";

export type SmartReplaceTone = "positive" | "negative" | "warning" | "neutral";

export type SmartReplaceSummaryMetricKind =
  | "positionsToReview"
  | "bestReplacementMatches"
  | "potentialScoreImprovement"
  | "estimatedUpsideDifference";

export type SmartReplaceSummaryMetric = {
  kind: SmartReplaceSummaryMetricKind;
  value: number;
  unit: "count" | "points" | "percent";
  helperKey: string;
  tone: SmartReplaceTone;
  trend: number[];
};

export type SmartReplaceDetail = {
  labelKey: string;
  value: string | number;
  valueKind?: "money" | "percent" | "text";
  currency?: CurrencyCode;
  tone?: SmartReplaceTone;
};

export type WeakPosition = {
  id: string;
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  sectorKey: string;
  score: number;
  suggestedAction: SuggestedAction;
  currentWeightPercent: number;
  avgCost: number;
  marketValue: number;
  currency: CurrencyCode;
  unrealizedPlPercent: number;
  concerns: string[];
};

export type ReplacementMatchType =
  | "sameSector"
  | "similarBusiness"
  | "qualityUpgrade"
  | "lowerRisk";

export type ReplacementCandidateAction = "bestMatch" | "consider" | "watch";

export type SwapImpactMetricKey =
  | "portfolioScore"
  | "technologyExposure"
  | "expectedUpside"
  | "annualizedReturnEstimate"
  | "riskScore";

export type SwapImpactMetric = {
  key: SwapImpactMetricKey;
  before: number;
  after: number;
  unit: "points" | "percent" | "beta";
  decimals: number;
  lowerIsBetter?: boolean;
};

export type SwapSimulationState = {
  candidateId: string;
  metrics: SwapImpactMetric[];
};

export type ReplacementCandidate = {
  id: string;
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  sectorKey: string;
  matchType: ReplacementMatchType;
  score: number;
  upsidePercent: number;
  beta: number;
  keyReasonKey: string;
  action: ReplacementCandidateAction;
  estimatedWeightPercent: number;
  currentPrice: number;
  currency: CurrencyCode;
  analystConsensusKey: string;
  positives: string[];
  simulation: SwapSimulationState;
};

export type RecommendationReason = {
  key: string;
  tone: SmartReplaceTone;
};

export type UpgradeDowngradeSignal = {
  id: string;
  type: "upgrade" | "downgrade";
  symbol: string;
  companyName: string;
  descriptionKey: string;
  ageKey: string;
};

export type SmartReplaceAiNote = {
  bodyKey: string;
  disclaimerKey: string;
};

export type SmartReplaceData = {
  summaryMetrics: SmartReplaceSummaryMetric[];
  weakPositions: WeakPosition[];
  defaultWeakPositionId: string;
  replacementCandidates: ReplacementCandidate[];
  defaultReplacementCandidateId: string;
  recommendationReasons: RecommendationReason[];
  otherWeakPositions: WeakPosition[];
  upgradeDowngradeSignals: UpgradeDowngradeSignal[];
  aiNote: SmartReplaceAiNote;
};
