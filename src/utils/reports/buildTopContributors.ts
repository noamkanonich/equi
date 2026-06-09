import type { ContributorReportItem } from "@/data/reports/reports.types";
import { reportsMockContributors } from "@/data/reports/reports.mock";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

export const buildTopContributors = (
  holdings: EnrichedPortfolioHolding[],
  cashAvailable: number,
  limit = 6,
  isUsingDemoPortfolio = true,
): ContributorReportItem[] => {
  if (holdings.length === 0) {
    if (!isUsingDemoPortfolio) {
      return [];
    }

    const maxAmount = Math.max(
      ...reportsMockContributors.map((item) => Math.abs(item.contributionAmount)),
      1,
    );

    return reportsMockContributors.slice(0, limit).map((item) => ({
      symbol: item.symbol,
      companyName: item.companyName,
      contributionAmount: item.contributionAmount,
      contributionPercent: item.contributionPercent,
      barPercent: (Math.abs(item.contributionAmount) / maxAmount) * 100,
      tone:
        item.contributionAmount > 0
          ? "positive"
          : item.contributionAmount < 0
            ? "negative"
            : "neutral",
      isCash: item.isCash,
    }));
  }

  const sorted = [...holdings].sort(
    (first, second) => second.totalGainLoss - first.totalGainLoss,
  );

  const totalAbs = sorted.reduce(
    (sum, holding) => sum + Math.abs(holding.totalGainLoss),
    0,
  );

  const rows: ContributorReportItem[] = sorted.slice(0, limit - (cashAvailable > 0 ? 1 : 0)).map(
    (holding) => ({
      symbol: holding.symbol,
      companyName: holding.companyName,
      contributionAmount: holding.totalGainLoss,
      contributionPercent: holding.totalGainLossPercent,
      barPercent:
        totalAbs === 0 ? 0 : (Math.abs(holding.totalGainLoss) / totalAbs) * 100,
      tone:
        holding.totalGainLoss > 0
          ? "positive"
          : holding.totalGainLoss < 0
            ? "negative"
            : "neutral",
    }),
  );

  if (cashAvailable > 0 && rows.length < limit) {
    rows.push({
      symbol: "CASH",
      companyName: "Cash",
      contributionAmount: cashAvailable,
      contributionPercent:
        holdings.reduce((sum, h) => sum + h.marketValue, 0) + cashAvailable === 0
          ? 0
          : (cashAvailable /
              (holdings.reduce((sum, h) => sum + h.marketValue, 0) + cashAvailable)) *
            100,
      barPercent: 12,
      tone: "neutral",
      isCash: true,
    });
  }

  return rows;
};
