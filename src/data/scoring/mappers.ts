export {
  scoringFactorKeys,
  recommendedScoringWeights,
  scoringFactorMeta,
  defaultScoringWeights,
  mockScoringInputs,
  getMockScoringInputBySymbol,
} from "./scoring.mock";

// TODO: mapRawScoreInputsToStockScoringInput — normalize provider metrics into StockScoringInput

export type {
  ScoringFactorKey,
  ScoringFactorImpact,
  ScoringFactorAccent,
  ScoringFactorWeights,
  ScoringFactorMeta,
  ScoringModelHealthLabelKey,
  ScoreCategory,
  ScoreStatus,
  ScoreConfidence,
  SuggestedAction,
  ScoringWeights,
  ScoreFactorInput,
  ScoringReason,
  ScoringRisk,
  CategoryScoreResult,
  OverallScoreResult,
  StockScoringInput,
} from "./scoring.types";
