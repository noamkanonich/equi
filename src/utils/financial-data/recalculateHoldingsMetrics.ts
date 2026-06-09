import type { DashboardMetric } from "@/data/dashboard/dashboard.types";
import type { PortfolioMetric } from "@/data/portfolio/portfolio.types";
import type { PortfolioSummary } from "@/data/portfolio/portfolio.types";

export type HoldingsValueInput = {
  shares: number;
  currentPrice: number;
  dayChangePercent: number;
  averageCost?: number;
  /** @deprecated Use averageCost */
  avgCost?: number;
};

export const calculateHoldingsTotalValue = (
  holdings: HoldingsValueInput[],
): number =>
  holdings.reduce(
    (total, holding) => total + holding.shares * holding.currentPrice,
    0,
  );

export const calculateHoldingsTodayChange = (
  holdings: HoldingsValueInput[],
): { amount: number; percent: number } => {
  const totalValue = calculateHoldingsTotalValue(holdings);

  if (totalValue <= 0) {
    return { amount: 0, percent: 0 };
  }

  const amount = holdings.reduce((total, holding) => {
    const changePerShare = holding.currentPrice * (holding.dayChangePercent / 100);
    return total + holding.shares * changePerShare;
  }, 0);

  const percent = (amount / totalValue) * 100;

  return {
    amount: Number(amount.toFixed(2)),
    percent: Number(percent.toFixed(2)),
  };
};

export const recalculateDashboardMetrics = (
  metrics: DashboardMetric[],
  holdings: HoldingsValueInput[],
  cashAvailable = 0,
): DashboardMetric[] => {
  const holdingsMarketValue = calculateHoldingsTotalValue(holdings);
  const totalValue = holdingsMarketValue + cashAvailable;
  const todayChange = calculateHoldingsTodayChange(holdings);
  const totalReturn = calculateHoldingsTotalReturn(holdings);
  const cashWeightPercent =
    totalValue === 0 ? 0 : (cashAvailable / totalValue) * 100;

  return metrics.map((metric) => {
    if (metric.kind === "totalValue" && totalValue > 0) {
      return {
        ...metric,
        value: Number(totalValue.toFixed(2)),
        secondaryValue: todayChange.percent,
        tone: mapToneFromValue(todayChange.amount),
      };
    }

    if (metric.kind === "todayChange") {
      return {
        ...metric,
        value: todayChange.amount,
        secondaryValue: todayChange.percent,
        tone: mapToneFromValue(todayChange.amount),
      };
    }

    if (metric.kind === "totalGainLoss") {
      return {
        ...metric,
        value: totalReturn.amount,
        secondaryValue: totalReturn.percent,
        tone: mapToneFromValue(totalReturn.amount),
      };
    }

    if (metric.kind === "cashAvailable") {
      return {
        ...metric,
        value: cashAvailable,
        secondaryValue: Number(cashWeightPercent.toFixed(2)),
        tone: "neutral" as const,
      };
    }

    return metric;
  });
};

export const recalculatePortfolioMetrics = (
  metrics: PortfolioMetric[],
  holdings: HoldingsValueInput[],
  summary?: PortfolioSummary,
): PortfolioMetric[] => {
  const totalValue = calculateHoldingsTotalValue(holdings);
  const todayChange = calculateHoldingsTodayChange(holdings);
  const totalReturn = calculateHoldingsTotalReturn(holdings);

  return metrics.map((metric) => {
    if (metric.kind === "totalValue" && totalValue > 0) {
      return {
        ...metric,
        value: summary?.totalValue ?? Number(totalValue.toFixed(2)),
        secondaryValue: summary?.todayChangePercent ?? todayChange.percent,
      };
    }

    if (metric.kind === "todayChange") {
      return {
        ...metric,
        value: summary?.todayChange ?? todayChange.amount,
        secondaryValue: summary?.todayChangePercent ?? todayChange.percent,
        tone: mapToneFromValue(summary?.todayChange ?? todayChange.amount),
      };
    }

    if (metric.kind === "totalReturn") {
      return {
        ...metric,
        value: summary?.totalReturn ?? totalReturn.amount,
        secondaryValue: summary?.totalReturnPercent ?? totalReturn.percent,
        tone: mapToneFromValue(summary?.totalReturn ?? totalReturn.amount),
      };
    }

    return metric;
  });
};

export const recalculateTotalPortfolioValue = (
  holdings: HoldingsValueInput[],
  fallbackTotal: number,
): number => {
  const total = calculateHoldingsTotalValue(holdings);
  return total > 0 ? Number(total.toFixed(2)) : fallbackTotal;
};

export const calculateHoldingsTotalReturn = (
  holdings: HoldingsValueInput[],
): { amount: number; percent: number } => {
  const totalMarketValue = calculateHoldingsTotalValue(holdings);
  const totalCostBasis = holdings.reduce(
    (total, holding) =>
      total + holding.shares * (holding.averageCost ?? holding.avgCost ?? 0),
    0,
  );

  if (totalCostBasis <= 0) {
    return { amount: 0, percent: 0 };
  }

  const amount = totalMarketValue - totalCostBasis;
  const percent = (amount / totalCostBasis) * 100;

  return {
    amount: Number(amount.toFixed(2)),
    percent: Number(percent.toFixed(2)),
  };
};

export const recalculatePortfolioSummary = (
  fallbackSummary: PortfolioSummary,
  holdings: HoldingsValueInput[],
): PortfolioSummary => {
  const totalValue = calculateHoldingsTotalValue(holdings);

  if (totalValue <= 0) {
    return fallbackSummary;
  }

  const todayChange = calculateHoldingsTodayChange(holdings);
  const totalReturn = calculateHoldingsTotalReturn(holdings);

  return {
    ...fallbackSummary,
    totalValue: Number(totalValue.toFixed(2)),
    todayChange: todayChange.amount,
    todayChangePercent: todayChange.percent,
    totalReturn: totalReturn.amount,
    totalReturnPercent: totalReturn.percent,
  };
};

const mapToneFromValue = (value: number): "positive" | "negative" | "neutral" => {
  if (value > 0) {
    return "positive";
  }
  if (value < 0) {
    return "negative";
  }
  return "neutral";
};
