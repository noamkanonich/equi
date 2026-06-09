import {
  reportsAvailableReports,
  reportsMockAllocation,
  reportsMockAllocationSectorDetails,
  reportsMockBenchmarkComparisons,
  reportsMockKeyStatistics,
  reportsMockMonthlySummary,
  reportsMockRiskAiInsight,
  reportsMockSummary,
  reportsPerformanceByBenchmark,
} from "@/data/reports/reports.mock";
import type { ReportPeriodKey, ReportsPageData } from "@/data/reports/reports.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type {
  EnrichedPortfolioHolding,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";
import { buildAllocationReport } from "./buildAllocationReport";
import { buildAllocationSectorDetails } from "./buildAllocationSectorDetails";
import { buildBenchmarkComparisons } from "./buildBenchmarkComparisons";
import { buildReportActivities } from "./buildReportActivities";
import { buildRiskMetrics } from "./buildRiskMetrics";
import { buildTaxData } from "./buildTaxData";
import { buildTopContributors } from "./buildTopContributors";
import { calculateReportMetrics } from "./calculateReportMetrics";

type BuildReportsPageDataInput = {
  holdings: EnrichedPortfolioHolding[];
  summary: PortfolioSummary;
  period: ReportPeriodKey;
  freshnessStatus: DataFreshnessStatus;
  hasHoldings: boolean;
  isUsingDemoPortfolio: boolean;
  bundles?: Record<string, StockProviderDataBundle>;
};

export const buildReportsPageData = ({
  holdings,
  summary,
  period,
  freshnessStatus,
  hasHoldings,
  isUsingDemoPortfolio,
  bundles = {},
}: BuildReportsPageDataInput): ReportsPageData => {
  const useLiveData = hasHoldings;
  const useDemoFallback = isUsingDemoPortfolio && !hasHoldings;
  const effectiveSummary = hasHoldings ? summary : useDemoFallback ? reportsMockSummary : summary;

  const metrics = calculateReportMetrics(
    effectiveSummary,
    holdings,
    period,
    useLiveData,
    isUsingDemoPortfolio,
  );

  const allocation = buildAllocationReport(holdings, effectiveSummary);
  const effectiveAllocation =
    allocation.length > 0
      ? allocation
      : useDemoFallback
        ? reportsMockAllocation
        : [];

  const allocationSectorDetails =
    allocation.length > 0
      ? buildAllocationSectorDetails(allocation, holdings)
      : useDemoFallback
        ? reportsMockAllocationSectorDetails
        : [];

  const { portfolioEndPercent, comparisons: benchmarkComparisons } =
    buildBenchmarkComparisons(reportsPerformanceByBenchmark, period);

  const effectiveBenchmarkComparisons =
    useLiveData
      ? benchmarkComparisons
      : useDemoFallback
        ? reportsMockBenchmarkComparisons
        : [];

  const contributors = buildTopContributors(
    holdings,
    effectiveSummary.cashAvailable ?? summary.cashAvailable,
    6,
    isUsingDemoPortfolio,
  );

  const bestHolding = [...holdings].sort(
    (a, b) => b.totalGainLossPercent - a.totalGainLossPercent,
  )[0];
  const worstHolding = [...holdings].sort(
    (a, b) => a.totalGainLossPercent - b.totalGainLossPercent,
  )[0];

  const keyStatistics =
    holdings.length > 0 && bestHolding && worstHolding
      ? [
          {
            key: "bestHolding",
            value: bestHolding.symbol,
            symbol: bestHolding.symbol,
          },
          {
            key: "worstHolding",
            value: worstHolding.symbol,
            symbol: worstHolding.symbol,
          },
          ...reportsMockKeyStatistics.filter(
            (item) => item.key !== "bestHolding" && item.key !== "worstHolding",
          ),
        ]
      : useDemoFallback
        ? reportsMockKeyStatistics
        : [];

  const { taxSummary, taxLots } = buildTaxData(
    holdings,
    effectiveSummary.currency,
    hasHoldings,
  );

  return {
    metrics,
    performanceByBenchmark: reportsPerformanceByBenchmark,
    portfolioEndPercent,
    allocation: effectiveAllocation,
    allocationSectorDetails,
    benchmarkComparisons: effectiveBenchmarkComparisons,
    contributors,
    keyStatistics,
    monthlySummary: reportsMockMonthlySummary,
    availableReports: reportsAvailableReports,
    activities: buildReportActivities(holdings, hasHoldings, isUsingDemoPortfolio),
    riskMetrics: buildRiskMetrics(holdings, bundles, hasHoldings),
    riskAiInsight: reportsMockRiskAiInsight,
    taxSummary,
    taxLots,
    totalValue: effectiveSummary.totalValue,
    currency: effectiveSummary.currency,
    freshnessStatus,
  };
};
