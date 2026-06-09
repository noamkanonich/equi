import { defaultScoringWeights, scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type {
  OverallScoreResult,
  ScoreFactorInput,
  ScoringWeights,
  StockScoringInput,
} from "@/data/scoring/scoring.types";
import { calculateCategoryScore } from "./calculateCategoryScore";
import { getScoreConfidence } from "./getScoreConfidence";
import { getScoreLabelKey } from "./getScoreLabelKey";
import { getScoreReasons } from "./getScoreReasons";
import { getScoreRisks } from "./getScoreRisks";
import { getScoreStatus } from "./getScoreStatus";
import { getSuggestedAction } from "./getSuggestedAction";
import { mapStockScoringInputToCategoryInputs } from "./mappers";
import { normalizeScoringWeights } from "./normalizeScoringWeights";

// Real provider data should be mapped into StockScoringInput before scoring.
export const calculateOverallScore = (
  input: StockScoringInput,
  weights: ScoringWeights = defaultScoringWeights,
): OverallScoreResult => {
  const normalizedWeights = normalizeScoringWeights(weights);
  const categoryInputs = mapStockScoringInputToCategoryInputs(input);
  const categoryScores = categoryInputs.map(calculateCategoryScore);

  const weightedSum = scoringFactorKeys.reduce(
    (sum, key) =>
      sum +
      (categoryInputs.find((item) => item.category === key)?.score ?? 0) *
        normalizedWeights[key],
    0,
  );

  const score = Math.round(weightedSum / 100);
  const status = getScoreStatus(score);
  const categoryScoreSummary = categoryInputs.map(({ category, score: categoryScore }) => ({
    category,
    score: categoryScore,
  }));

  return {
    score,
    status,
    labelKey: getScoreLabelKey(status),
    suggestedAction: getSuggestedAction(score),
    confidence: getScoreConfidence(categoryInputs),
    categoryScores,
    reasons: getScoreReasons(categoryScoreSummary),
    risks: getScoreRisks(categoryScoreSummary),
  };
};

export const calculateOverallScoreFromFactors = (
  categoryInputs: ScoreFactorInput[],
  weights: ScoringWeights = defaultScoringWeights,
): OverallScoreResult => {
  const normalizedWeights = normalizeScoringWeights(weights);
  const categoryScores = categoryInputs.map(calculateCategoryScore);

  const weightedSum = scoringFactorKeys.reduce((sum, key) => {
    const categoryScore =
      categoryInputs.find((item) => item.category === key)?.score ?? 0;
    return sum + categoryScore * normalizedWeights[key];
  }, 0);

  const score = Math.round(weightedSum / 100);
  const status = getScoreStatus(score);
  const categoryScoreSummary = categoryInputs.map(({ category, score: categoryScore }) => ({
    category,
    score: categoryScore,
  }));

  return {
    score,
    status,
    labelKey: getScoreLabelKey(status),
    suggestedAction: getSuggestedAction(score),
    confidence: getScoreConfidence(categoryInputs),
    categoryScores,
    reasons: getScoreReasons(categoryScoreSummary),
    risks: getScoreRisks(categoryScoreSummary),
  };
};
