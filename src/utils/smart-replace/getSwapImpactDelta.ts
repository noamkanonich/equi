import type { SwapImpactMetric } from "@/data/smart-replace/smart-replace.types";

export const getSwapImpactDelta = (metric: SwapImpactMetric) => {
  const rawDelta = metric.after - metric.before;
  const displayDelta = metric.lowerIsBetter ? Math.abs(rawDelta) : rawDelta;

  return {
    rawDelta,
    displayDelta,
    isImprovement: metric.lowerIsBetter ? rawDelta < 0 : rawDelta > 0,
  };
};
