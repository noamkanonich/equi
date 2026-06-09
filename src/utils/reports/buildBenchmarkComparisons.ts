import type {
  PerformanceBenchmarkComparisonItem,
  ReportBenchmarkKey,
  ReportPerformancePoint,
  ReportPeriodKey,
} from "@/data/reports/reports.types";
import { buildPerformanceSeries } from "./buildPerformanceSeries";

const BENCHMARK_KEYS: ReportBenchmarkKey[] = ["sp500", "nasdaq", "msciWorld"];

type BuildBenchmarkComparisonsResult = {
  portfolioEndPercent: number;
  comparisons: PerformanceBenchmarkComparisonItem[];
};

export const buildBenchmarkComparisons = (
  performanceByBenchmark: Record<ReportBenchmarkKey, ReportPerformancePoint[]>,
  period: ReportPeriodKey,
): BuildBenchmarkComparisonsResult => {
  const firstSeries = buildPerformanceSeries(
    performanceByBenchmark[BENCHMARK_KEYS[0]],
    period,
  );
  const portfolioEndPercent = firstSeries.portfolioEndPercent;

  const comparisons: PerformanceBenchmarkComparisonItem[] = BENCHMARK_KEYS.map((key) => {
    const series = buildPerformanceSeries(performanceByBenchmark[key], period);
    const returnPercent = series.benchmarkEndPercent;
    const delta = Number((returnPercent - portfolioEndPercent).toFixed(2));

    return {
      key,
      returnPercent,
      deltaVsPortfolio: delta,
      // delta < 0 means benchmark is behind portfolio (user outperformed) → positive/green
      // delta > 0 means benchmark is ahead of portfolio (user underperformed) → negative/red
      tone:
        delta > 0.5
          ? "negative"
          : delta < -0.5
            ? "positive"
            : "neutral",
    };
  });

  return { portfolioEndPercent, comparisons };
};
