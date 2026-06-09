import type { ScoreConfidence, ScoreFactorInput } from "@/data/scoring/scoring.types";

export const getScoreConfidence = (
  categoryInputs: ScoreFactorInput[],
): ScoreConfidence => {
  if (categoryInputs.length === 0) return "low";

  const strongCount = categoryInputs.filter((input) => input.score >= 60).length;
  const weakCount = categoryInputs.filter((input) => input.score <= 45).length;

  if (strongCount >= 5 && categoryInputs.length >= 6) return "high";
  if (weakCount >= 2) return "low";
  return "medium";
};
