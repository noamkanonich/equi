import type { ScoreCategory, ScoringReason } from "@/data/scoring/scoring.types";

type CategoryReasonRule = {
  category: ScoreCategory;
  minScore: number;
  reason: ScoringReason;
};

const CATEGORY_REASON_RULES: CategoryReasonRule[] = [
  { category: "growth", minScore: 80, reason: "scoring.reasons.strongGrowth" },
  {
    category: "profitability",
    minScore: 80,
    reason: "scoring.reasons.strongProfitability",
  },
  {
    category: "financialHealth",
    minScore: 75,
    reason: "scoring.reasons.healthyBalanceSheet",
  },
  { category: "momentum", minScore: 75, reason: "scoring.reasons.positiveMomentum" },
  {
    category: "analystSentiment",
    minScore: 75,
    reason: "scoring.reasons.strongAnalystSentiment",
  },
  {
    category: "valuation",
    minScore: 70,
    reason: "scoring.reasons.attractiveValuation",
  },
];

export const getCategoryReasons = (
  category: ScoreCategory,
  score: number,
): ScoringReason[] => {
  return CATEGORY_REASON_RULES.filter(
    (rule) => rule.category === category && score >= rule.minScore,
  ).map((rule) => rule.reason);
};

export const getScoreReasons = (
  categoryScores: { category: ScoreCategory; score: number }[],
): ScoringReason[] => {
  const reasons = categoryScores.flatMap(({ category, score }) =>
    getCategoryReasons(category, score),
  );

  return [...new Set(reasons)].slice(0, 6);
};
