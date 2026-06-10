import type { CurrencyCode } from "@/data/currencies/currency.types";
import { buildChartData } from "@/data/stocks/stock-analysis.builders.mock";
import type {
  StockProviderDataBundle,
  StockProviderFinancialStatement,
  StockProviderIntradayHistory,
  StockProviderIntradayPoint,
  StockProviderKeyMetrics,
  StockProviderPricePoint,
  StockProviderQuote,
} from "@/data/financial-data/financial-data.types";
import type {
  FundamentalTrendMetric,
  FundamentalTrendStatus,
  StockAnalysisData,
  StockAnalystTarget,
  StockChartPoint,
  StockChartRange,
  StockKeyMetric,
} from "@/data/stocks/stock-analysis.types";
import { normalizePercent } from "@/utils/financial-data/normalizeNumeric";

const toBillions = (value: number): number =>
  Number((value / 1_000_000_000).toFixed(2));

const deriveTrendStatus = (values: number[]): FundamentalTrendStatus => {
  if (values.length < 2) {
    return "stable";
  }
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  if (last > prev * 1.02) {
    return "improving";
  }
  if (last < prev * 0.98) {
    return "declining";
  }
  return "stable";
};

const mapStatementsToTrendMetric = (input: {
  kind: FundamentalTrendMetric["kind"];
  unitKey: FundamentalTrendMetric["unitKey"];
  chartType: FundamentalTrendMetric["chartType"];
  insightKey: string;
  values: { year: string; value: number }[];
}): FundamentalTrendMetric | null => {
  if (input.values.length === 0) {
    return null;
  }

  const numericValues = input.values.map((point) => point.value);

  return {
    kind: input.kind,
    unitKey: input.unitKey,
    status: deriveTrendStatus(numericValues),
    chartType: input.chartType,
    data: input.values,
    insightKey: input.insightKey,
  };
};

const buildTrendMetricsFromStatements = (
  income: StockProviderFinancialStatement[],
  cashFlow: StockProviderFinancialStatement[],
): FundamentalTrendMetric[] => {
  const sortedIncome = [...income].sort((a, b) => a.fiscalYear - b.fiscalYear);
  const sortedCashFlow = [...cashFlow].sort((a, b) => a.fiscalYear - b.fiscalYear);

  const yearLabel = (statement: StockProviderFinancialStatement) =>
    String(statement.fiscalYear);

  const metrics: (FundamentalTrendMetric | null)[] = [
    mapStatementsToTrendMetric({
      kind: "revenue",
      unitKey: "billions",
      chartType: "bar",
      insightKey: "fundamentals.insights.revenue",
      values: sortedIncome
        .filter((row) => row.revenue != null)
        .map((row) => ({
          year: yearLabel(row),
          value: toBillions(row.revenue!),
        })),
    }),
    mapStatementsToTrendMetric({
      kind: "grossProfit",
      unitKey: "billions",
      chartType: "bar",
      insightKey: "fundamentals.insights.grossProfit",
      values: sortedIncome
        .filter((row) => row.grossProfit != null)
        .map((row) => ({
          year: yearLabel(row),
          value: toBillions(row.grossProfit!),
        })),
    }),
    mapStatementsToTrendMetric({
      kind: "operatingIncome",
      unitKey: "billions",
      chartType: "bar",
      insightKey: "fundamentals.insights.operatingIncome",
      values: sortedIncome
        .filter((row) => row.operatingIncome != null)
        .map((row) => ({
          year: yearLabel(row),
          value: toBillions(row.operatingIncome!),
        })),
    }),
    mapStatementsToTrendMetric({
      kind: "epsDiluted",
      unitKey: "perShare",
      chartType: "line",
      insightKey: "fundamentals.insights.epsDiluted",
      values: sortedIncome
        .filter((row) => row.eps != null)
        .map((row) => ({
          year: yearLabel(row),
          value: Number(row.eps!.toFixed(2)),
        })),
    }),
    mapStatementsToTrendMetric({
      kind: "freeCashFlow",
      unitKey: "billions",
      chartType: "bar",
      insightKey: "fundamentals.insights.freeCashFlow",
      values: sortedCashFlow
        .filter((row) => row.freeCashFlow != null)
        .map((row) => ({
          year: yearLabel(row),
          value: toBillions(row.freeCashFlow!),
        })),
    }),
  ];

  const operatingMarginValues = sortedIncome
    .filter((row) => row.revenue && row.operatingIncome && row.revenue > 0)
    .map((row) => ({
      year: yearLabel(row),
      value: Number(
        ((row.operatingIncome! / row.revenue!) * 100).toFixed(1),
      ),
    }));

  metrics.push(
    mapStatementsToTrendMetric({
      kind: "operatingMargin",
      unitKey: "percent",
      chartType: "line",
      insightKey: "fundamentals.insights.operatingMargin",
      values: operatingMarginValues,
    }),
  );

  return metrics.filter((metric): metric is FundamentalTrendMetric => metric !== null);
};

const getLatestFreeCashFlow = (
  cashFlowStatements: StockProviderFinancialStatement[],
): number | undefined => {
  const sorted = [...cashFlowStatements].sort(
    (a, b) => b.fiscalYear - a.fiscalYear,
  );
  const latest = sorted.find((row) => row.freeCashFlow != null);
  return latest?.freeCashFlow;
};

const mapKeyMetricsToStockKeyMetrics = (
  metrics: StockProviderKeyMetrics,
  currency: CurrencyCode,
  cashFlowStatements: StockProviderFinancialStatement[],
  nextEarningsDate?: string,
): StockKeyMetric[] => {
  const items: StockKeyMetric[] = [];

  if (metrics.peRatio != null) {
    items.push({ kind: "pe", value: Number(metrics.peRatio.toFixed(2)), format: "number" });
  }
  if (metrics.pegRatio != null) {
    items.push({ kind: "peg", value: Number(metrics.pegRatio.toFixed(2)), format: "ratio" });
  }

  const revenueGrowth = normalizePercent(metrics.revenueGrowth);
  if (revenueGrowth != null) {
    items.push({
      kind: "revenueGrowth",
      value: revenueGrowth,
      format: "percent",
    });
  }

  const grossMargin = normalizePercent(metrics.grossMargin);
  if (grossMargin != null) {
    items.push({
      kind: "grossMargin",
      value: grossMargin,
      format: "percent",
    });
  }

  const operatingMargin = normalizePercent(metrics.operatingMargin);
  if (operatingMargin != null) {
    items.push({
      kind: "operatingMargin",
      value: operatingMargin,
      format: "percent",
    });
  }

  if (metrics.marketCap != null) {
    items.push({
      kind: "marketCap",
      value: metrics.marketCap,
      format: "money",
      currency,
    });
  }

  const latestFreeCashFlow = getLatestFreeCashFlow(cashFlowStatements);
  if (latestFreeCashFlow != null) {
    items.push({
      kind: "freeCashFlow",
      value: latestFreeCashFlow,
      format: "money",
      currency,
    });
  }

  if (metrics.debtToEquity != null) {
    items.push({
      kind: "debtToEquity",
      value: Number(metrics.debtToEquity.toFixed(2)),
      format: "ratio",
    });
  }

  const roe = normalizePercent(metrics.roe);
  if (roe != null) {
    items.push({
      kind: "roe",
      value: roe,
      format: "percent",
    });
  }

  if (nextEarningsDate) {
    items.push({ kind: "nextEarnings", value: nextEarningsDate, format: "date" });
  }

  return items;
};

const slicePoints = (
  points: StockProviderPricePoint[],
  count: number,
): StockProviderPricePoint[] => {
  if (points.length <= count) {
    return points;
  }
  return points.slice(-count);
};

const pointsToChart = (points: StockProviderPricePoint[]): StockChartPoint[] =>
  points.map((point) => ({
    label: point.date.slice(5),
    price: point.close,
    timestamp: point.date,
  }));

const buildOneDayFromIntraday = (
  points: StockProviderIntradayPoint[],
): StockChartPoint[] =>
  points.map((point) => ({
    label: point.time,
    price: point.price,
    timestamp: point.time,
  }));

const buildOneDayFromQuote = (quote: StockProviderQuote): StockChartPoint[] =>
  buildChartData(quote.price, quote.previousClose).oneDay;

const buildChartDataFromHistory = (
  points: StockProviderPricePoint[],
  baseChartData: Record<StockChartRange, StockChartPoint[]>,
  intraday?: StockProviderIntradayHistory | null,
  quote?: StockProviderQuote | null,
): Record<StockChartRange, StockChartPoint[]> => {
  const oneDayFromIntraday =
    intraday?.points.length ? buildOneDayFromIntraday(intraday.points) : null;
  const oneDayFromQuote = quote && quote.price > 0 ? buildOneDayFromQuote(quote) : null;

  const oneDay =
    oneDayFromIntraday && oneDayFromIntraday.length > 0
      ? oneDayFromIntraday
      : oneDayFromQuote && oneDayFromQuote.length > 0
        ? oneDayFromQuote
        : baseChartData.oneDay;

  if (points.length === 0) {
    return {
      ...baseChartData,
      oneDay,
    };
  }

  const oneWeek = pointsToChart(slicePoints(points, 5));
  const oneMonth = pointsToChart(slicePoints(points, 22));
  const oneYear = pointsToChart(slicePoints(points, 252));

  const byYear = new Map<string, StockProviderPricePoint>();
  for (const point of points) {
    const year = point.date.slice(0, 4);
    byYear.set(year, point);
  }
  const max = Array.from(byYear.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => ({
      label: point.date.slice(0, 4),
      price: point.close,
      timestamp: point.date,
    }));

  return {
    oneDay,
    oneWeek: oneWeek.length ? oneWeek : baseChartData.oneWeek,
    oneMonth: oneMonth.length ? oneMonth : baseChartData.oneMonth,
    oneYear: oneYear.length ? oneYear : baseChartData.oneYear,
    max: max.length ? max : baseChartData.max,
  };
};

const mapAnalystConsensusKey = (
  target: NonNullable<StockProviderDataBundle["analystTarget"]>,
): StockAnalystTarget["consensusKey"] => {
  switch (target.consensus) {
    case "buy":
      return "buy";
    case "sell":
      return "sell";
    case "hold":
      return "hold";
    default:
      return "hold";
  }
};

const hasRealAnalystTarget = (bundle: StockProviderDataBundle): boolean => {
  const source = bundle.meta.sectionProviders?.analystTarget;

  return Boolean(source && source !== "mock");
};

export const enrichStockAnalysisWithBundle = (
  base: StockAnalysisData,
  bundle: StockProviderDataBundle,
): StockAnalysisData => {
  const profile = bundle.profile;
  const quote = bundle.quote;
  const keyMetrics = bundle.keyMetrics;
  const nextEarnings = bundle.earnings[0]?.date;

  let enriched: StockAnalysisData = { ...base };

  if (profile) {
    enriched = {
      ...enriched,
      companyName: profile.companyName,
      logoUrl: profile.logoUrl ?? enriched.logoUrl,
      exchange: profile.exchange,
    };
  }

  if (quote) {
    enriched = {
      ...enriched,
      currentPrice: quote.price,
      previousClose: quote.previousClose,
      dayChange: quote.change,
      dayChangePercent: quote.changePercent,
      lastUpdated: quote.updatedAt,
      currency: quote.currency,
    };
  }

  if (
    bundle.priceHistory?.points.length ||
    bundle.intraday?.points.length ||
    quote
  ) {
    enriched = {
      ...enriched,
      chartData: buildChartDataFromHistory(
        bundle.priceHistory?.points ?? [],
        enriched.chartData,
        bundle.intraday,
        quote ?? null,
      ),
    };
  }

  if (keyMetrics) {
    const mappedMetrics = mapKeyMetricsToStockKeyMetrics(
      keyMetrics,
      enriched.currency,
      bundle.cashFlowStatements,
      nextEarnings,
    );
    if (mappedMetrics.length > 0) {
      enriched = {
        ...enriched,
        keyMetrics: mappedMetrics,
      };
    }
  }

  const trendMetrics = buildTrendMetricsFromStatements(
    bundle.incomeStatements,
    bundle.cashFlowStatements,
  );

  if (trendMetrics.length > 0) {
    enriched = {
      ...enriched,
      fundamentals: {
        ...enriched.fundamentals,
        trendMetrics,
      },
    };
  }

  if (bundle.analystTarget && hasRealAnalystTarget(bundle)) {
    const target = bundle.analystTarget;
    enriched = {
      ...enriched,
      analystTarget: {
        averageTarget: target.averageTarget,
        upsidePercent: target.upsidePercent,
        high: target.highTarget,
        low: target.lowTarget,
        consensusKey: mapAnalystConsensusKey(target),
        analystCount: target.analystCount ?? enriched.analystTarget.analystCount,
        distribution: target.distribution ?? enriched.analystTarget.distribution,
        isFallback: false,
      },
    };
  } else {
    enriched = {
      ...enriched,
      analystTarget: {
        ...enriched.analystTarget,
        isFallback: true,
      },
    };
  }

  return enriched;
};
