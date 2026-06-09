export type PortfolioScoreTier = "excellent" | "good" | "watch" | "poor";

export type PortfolioScoreTierResult = {
  tier: PortfolioScoreTier;
  colorKey: "status.positive" | "brand.primary" | "status.warning" | "status.negative";
};

export const getPortfolioScoreTier = (score: number): PortfolioScoreTierResult => {
  const normalizedScore = Math.max(0, Math.min(100, score));

  if (normalizedScore >= 85) {
    return { tier: "excellent", colorKey: "status.positive" };
  }

  if (normalizedScore >= 70) {
    return { tier: "good", colorKey: "brand.primary" };
  }

  if (normalizedScore >= 55) {
    return { tier: "watch", colorKey: "status.warning" };
  }

  return { tier: "poor", colorKey: "status.negative" };
};
