import type { ScoreCategory, ScoringRisk } from "@/data/scoring/scoring.types";

type CategoryRiskRule = {
  category: ScoreCategory;
  maxScore: number;
  risk: ScoringRisk;
};

const CATEGORY_RISK_RULES: CategoryRiskRule[] = [
  { category: "growth", maxScore: 45, risk: "scoring.risks.weakGrowth" },
  {
    category: "profitability",
    maxScore: 45,
    risk: "scoring.risks.lowProfitability",
  },
  {
    category: "valuation",
    maxScore: 45,
    risk: "scoring.risks.stretchedValuation",
  },
  {
    category: "financialHealth",
    maxScore: 45,
    risk: "scoring.risks.weakFinancialHealth",
  },
  { category: "momentum", maxScore: 45, risk: "scoring.risks.negativeMomentum" },
  {
    category: "analystSentiment",
    maxScore: 45,
    risk: "scoring.risks.weakAnalystSentiment",
  },
];

export const getCategoryRisks = (
  category: ScoreCategory,
  score: number,
): ScoringRisk[] => {
  return CATEGORY_RISK_RULES.filter(
    (rule) => rule.category === category && score <= rule.maxScore,
  ).map((rule) => rule.risk);
};

export const getScoreRisks = (
  categoryScores: { category: ScoreCategory; score: number }[],
): ScoringRisk[] => {
  const risks = categoryScores.flatMap(({ category, score }) =>
    getCategoryRisks(category, score),
  );

  return [...new Set(risks)].slice(0, 6);
};
