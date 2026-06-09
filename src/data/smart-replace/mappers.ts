import type {
  ReplacementCandidateAction,
  ReplacementMatchType,
  SmartReplaceTone,
  SwapImpactMetric,
} from "./smart-replace.types";

export const mapCandidateActionToTone = (
  action: ReplacementCandidateAction,
): SmartReplaceTone => {
  if (action === "bestMatch") return "positive";
  if (action === "consider") return "neutral";
  return "warning";
};

export const mapMatchTypeToTone = (
  matchType: ReplacementMatchType,
): SmartReplaceTone => {
  if (matchType === "lowerRisk") return "positive";
  if (matchType === "qualityUpgrade") return "positive";
  if (matchType === "sameSector") return "neutral";
  return "warning";
};

export const mapImpactMetricToTone = (
  metric: SwapImpactMetric,
): SmartReplaceTone => {
  const delta = metric.after - metric.before;

  if (delta === 0) return "neutral";
  if (metric.lowerIsBetter) return delta < 0 ? "positive" : "negative";
  return delta > 0 ? "positive" : "negative";
};
