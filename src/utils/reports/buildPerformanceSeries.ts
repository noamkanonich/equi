import type {
  ReportBenchmarkKey,
  ReportPerformancePoint,
  ReportPerformanceSeries,
  ReportPeriodKey,
} from "@/data/reports/reports.types";

const periodPointCount: Record<ReportPeriodKey, number> = {
  all: 23,
  oneYear: 22,
  sixMonths: 14,
  threeMonths: 10,
  thirtyDays: 6,
};

export const buildPerformanceSeries = (
  points: ReportPerformancePoint[],
  period: ReportPeriodKey,
): ReportPerformanceSeries => {
  const count = periodPointCount[period];
  const visible = points.slice(Math.max(0, points.length - count));
  const last = visible[visible.length - 1];

  return {
    points: visible,
    portfolioEndPercent: last?.portfolioPercent ?? 0,
    benchmarkEndPercent: last?.benchmarkPercent ?? 0,
  };
};

export const getPerformancePointsForBenchmark = (
  performanceByBenchmark: Record<ReportBenchmarkKey, ReportPerformancePoint[]>,
  benchmark: ReportBenchmarkKey,
): ReportPerformancePoint[] => performanceByBenchmark[benchmark] ?? [];
