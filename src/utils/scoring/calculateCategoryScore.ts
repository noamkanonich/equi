import type {
  CategoryScoreResult,
  ScoreFactorInput,
} from "@/data/scoring/scoring.types";
import { getScoreConfidence } from "./getScoreConfidence";
import { getScoreLabelKey } from "./getScoreLabelKey";
import { getCategoryReasons } from "./getScoreReasons";
import { getCategoryRisks } from "./getScoreRisks";
import { getScoreStatus } from "./getScoreStatus";

export const calculateCategoryScore = (
  input: ScoreFactorInput,
): CategoryScoreResult => {
  const score = Math.max(0, Math.min(100, Math.round(input.score)));
  const status = getScoreStatus(score);

  return {
    category: input.category,
    score,
    status,
    labelKey: getScoreLabelKey(status),
    reasons: getCategoryReasons(input.category, score),
    risks: getCategoryRisks(input.category, score),
    confidence: getScoreConfidence([input]),
  };
};
