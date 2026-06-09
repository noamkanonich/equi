import type {
  ScoreLabelKey,
  StockAnalysisData,
  StockChartRange,
  StockFundamentalsData,
  StockThesisNotes,
} from "@/data/stocks/stock-analysis.types";
import { scoreThresholds } from "@/config/scoring.config";

const CHART_RANGES: StockChartRange[] = [
  "oneDay",
  "oneWeek",
  "oneMonth",
  "oneYear",
  "max",
];

const REQUIRED_TREND_METRIC_COUNT = 6;

export const normalizeStockSymbol = (symbol: string): string => symbol.trim().toUpperCase();

/** Stock score label keys — breakpoints match scoreThresholds in scoring.config.ts */
export const mapScoreToLabelKey = (score: number): ScoreLabelKey => {
  if (score >= scoreThresholds.buyMore) return "veryStrong";
  if (score >= scoreThresholds.hold) return "strong";
  if (score >= scoreThresholds.watch) return "good";
  if (score >= scoreThresholds.reduce) return "watch";
  return "weak";
};

const hasValidChartData = (stock: StockAnalysisData): boolean =>
  CHART_RANGES.every((range) => (stock.chartData[range]?.length ?? 0) > 0);

const hasValidFundamentals = (fundamentals: StockFundamentalsData | undefined): boolean =>
  Boolean(
    fundamentals?.aiFundamentalRead?.whatsStrongKey &&
      fundamentals.trendMetrics.length >= REQUIRED_TREND_METRIC_COUNT &&
      fundamentals.valuationSnapshot.length > 0,
  );

const hasValidThesisNotes = (thesisNotes: StockThesisNotes | undefined): boolean =>
  Boolean(
    thesisNotes?.whyIOwnItKey && thesisNotes.whatToWatchKey && thesisNotes.sellIfKey,
  );

export const isStockAnalysisComplete = (stock: StockAnalysisData): boolean =>
  hasValidChartData(stock) &&
  hasValidFundamentals(stock.fundamentals) &&
  hasValidThesisNotes(stock.thesisNotes) &&
  stock.scoreBreakdown.length >= 6 &&
  stock.keyMetrics.length > 0 &&
  Boolean(stock.analystTarget) &&
  Boolean(stock.aiInsight?.whatsGoodKey);

const mergeFundamentals = (
  partial: StockFundamentalsData | undefined,
  fallback: StockFundamentalsData,
): StockFundamentalsData => {
  if (!partial || !hasValidFundamentals(partial)) {
    return fallback;
  }

  const trendMetrics =
    partial.trendMetrics.length >= REQUIRED_TREND_METRIC_COUNT
      ? partial.trendMetrics
      : fallback.trendMetrics;

  const valuationSnapshot =
    partial.valuationSnapshot.length > 0
      ? partial.valuationSnapshot
      : fallback.valuationSnapshot;

  return {
    aiFundamentalRead: {
      whatsStrongKey:
        partial.aiFundamentalRead.whatsStrongKey ||
        fallback.aiFundamentalRead.whatsStrongKey,
      riskToWatchKey:
        partial.aiFundamentalRead.riskToWatchKey ||
        fallback.aiFundamentalRead.riskToWatchKey,
      whatToMonitorKey:
        partial.aiFundamentalRead.whatToMonitorKey ||
        fallback.aiFundamentalRead.whatToMonitorKey,
    },
    trendMetrics,
    valuationSnapshot,
  };
};

export const mergeStockAnalysis = (
  partial: StockAnalysisData,
  fallback: StockAnalysisData,
): StockAnalysisData => {
  const symbol = partial.symbol || fallback.symbol;

  return {
    ...fallback,
    ...partial,
    symbol,
    companyName: partial.companyName || fallback.companyName,
    logoUrl: partial.logoUrl ?? fallback.logoUrl,
    chartData: hasValidChartData(partial) ? partial.chartData : fallback.chartData,
    scoreBreakdown:
      partial.scoreBreakdown.length >= 6
        ? partial.scoreBreakdown
        : fallback.scoreBreakdown,
    keyMetrics:
      partial.keyMetrics.length > 0 ? partial.keyMetrics : fallback.keyMetrics,
    latestNews:
      partial.latestNews.length > 0 ? partial.latestNews : fallback.latestNews,
    analystTarget: partial.analystTarget ?? fallback.analystTarget,
    userPosition: partial.userPosition ?? fallback.userPosition,
    thesisNotes: hasValidThesisNotes(partial.thesisNotes)
      ? partial.thesisNotes
      : fallback.thesisNotes,
    aiInsight: partial.aiInsight?.whatsGoodKey
      ? partial.aiInsight
      : fallback.aiInsight,
    fundamentals: mergeFundamentals(partial.fundamentals, fallback.fundamentals),
  };
};

// TODO: mapProviderQuoteToStockAnalysis — normalize provider quote/summary into StockAnalysisData
// TODO: mapProviderFundamentalsToStockFundamentals — normalize provider fundamentals into StockFundamentalsData
