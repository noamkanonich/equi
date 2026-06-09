import { format, parseISO } from "date-fns";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import {
  normalizeNullableNumber,
  normalizeRatio,
} from "@/utils/financial-data/normalizeNumeric";
import type {
  StockProviderAnalystConsensus,
  StockProviderAnalystDistribution,
  StockProviderAnalystTarget,
  StockProviderEarningsEvent,
  StockProviderEarningsImpact,
  StockProviderEarningsTime,
  StockProviderFinancialStatement,
  StockProviderIntradayHistory,
  StockProviderKeyMetrics,
  StockProviderNewsItem,
  StockProviderPriceHistory,
  StockProviderProfile,
  StockProviderQuote,
} from "@/data/financial-data/financial-data.types";
import type {
  FmpCashFlowStatement,
  FmpEarningCalendar,
  FmpGradesConsensus,
  FmpHistoricalPriceFull,
  FmpHistoricalPricePoint,
  FmpIncomeStatement,
  FmpIntradayBar,
  FmpKeyMetrics,
  FmpPriceTargetConsensus,
  FmpPriceTargetSummary,
  FmpProfile,
  FmpQuote,
  FmpStockNews,
} from "./fmp.types";

const normalizeCurrency = (currency?: string): CurrencyCode => {
  const upper = currency?.toUpperCase();
  if (upper === "ILS" || upper === "EUR") {
    return upper;
  }
  return "USD";
};

const parseFiscalYear = (dateStr: string, calendarYear?: string): number => {
  if (calendarYear) {
    const parsed = Number(calendarYear);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  try {
    return parseISO(dateStr).getFullYear();
  } catch {
    return new Date().getFullYear();
  }
};

export const mapFmpProfileToStockProviderProfile = (
  raw: FmpProfile,
): StockProviderProfile => ({
  symbol: normalizeProviderSymbol(raw.symbol),
  companyName: raw.companyName,
  description: raw.description,
  exchange: raw.exchangeShortName ?? raw.exchange ?? "UNKNOWN",
  sector: raw.sector,
  industry: raw.industry,
  country: raw.country,
  website: raw.website,
  logoUrl: raw.image ?? null,
  currency: normalizeCurrency(raw.currency),
  marketCap: raw.mktCap,
  beta: raw.beta,
  ceo: raw.ceo,
  employees: raw.fullTimeEmployees,
  ipoDate: raw.ipoDate,
});

export const mapFmpQuoteToStockProviderQuote = (raw: FmpQuote): StockProviderQuote => {
  const price = raw.price ?? 0;
  const previousClose = raw.previousClose ?? price;
  const change = raw.change ?? price - previousClose;
  const changePercent =
    previousClose !== 0 && Number.isFinite(change)
      ? (change / previousClose) * 100
      : raw.changesPercentage ?? 0;

  const updatedAt = raw.timestamp
    ? new Date(raw.timestamp * 1000).toISOString()
    : new Date().toISOString();

  return {
    symbol: normalizeProviderSymbol(raw.symbol),
    price,
    change: Number(change.toFixed(4)),
    changePercent: Number(changePercent.toFixed(2)),
    previousClose,
    dayHigh: raw.dayHigh ?? price,
    dayLow: raw.dayLow ?? price,
    volume: raw.volume ?? 0,
    marketCap: raw.marketCap,
    currency: "USD",
    updatedAt,
  };
};

export const mapFmpKeyMetricsToStockProviderKeyMetrics = (
  raw: FmpKeyMetrics,
): StockProviderKeyMetrics => ({
  symbol: normalizeProviderSymbol(raw.symbol),
  currency: "USD",
  asOfDate: raw.date ?? new Date().toISOString().slice(0, 10),
  peRatio: raw.peRatio,
  pegRatio: raw.pegRatio,
  priceToSalesRatio: raw.priceToSalesRatio,
  enterpriseValue: raw.enterpriseValue,
  marketCap: raw.marketCap,
  revenuePerShare: raw.revenuePerShare,
  netIncomePerShare: raw.netIncomePerShare,
  operatingCashFlowPerShare: raw.operatingCashFlowPerShare,
  freeCashFlowPerShare: raw.freeCashFlowPerShare,
  debtToEquity: normalizeNullableNumber(raw.debtToEquity),
  currentRatio: raw.currentRatio,
  grossMargin: normalizeRatio(raw.grossProfitMargin),
  operatingMargin: normalizeRatio(raw.operatingProfitMargin),
  netMargin: normalizeRatio(raw.netProfitMargin),
  revenueGrowth: normalizeRatio(raw.revenueGrowth),
  epsGrowth: normalizeRatio(raw.epsgrowth),
  roe: normalizeRatio(raw.roe),
  roa: normalizeRatio(raw.roa),
});

export const mapFmpIncomeStatementToStockProvider = (
  raw: FmpIncomeStatement,
): StockProviderFinancialStatement => ({
  symbol: normalizeProviderSymbol(raw.symbol),
  period: raw.period ?? raw.date,
  fiscalYear: parseFiscalYear(raw.date, raw.calendarYear),
  statementType: "income",
  revenue: raw.revenue,
  grossProfit: raw.grossProfit,
  operatingIncome: raw.operatingIncome,
  netIncome: raw.netIncome,
  eps: raw.epsdiluted ?? raw.eps,
  currency: normalizeCurrency(raw.reportedCurrency),
});

export const mapFmpCashFlowToStockProvider = (
  raw: FmpCashFlowStatement,
): StockProviderFinancialStatement => ({
  symbol: normalizeProviderSymbol(raw.symbol),
  period: raw.period ?? raw.date,
  fiscalYear: parseFiscalYear(raw.date, raw.calendarYear),
  statementType: "cashFlow",
  operatingCashFlow: raw.operatingCashFlow,
  freeCashFlow: raw.freeCashFlow,
  currency: normalizeCurrency(raw.reportedCurrency),
});

const mapHistoricalPoints = (
  points: FmpHistoricalPricePoint[],
): StockProviderPriceHistory["points"] =>
  points
    .filter((point) => point.close > 0)
    .map((point) => ({
      date: point.date,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: point.volume,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

export const mapFmpHistoricalPriceToStockProvider = (
  raw: FmpHistoricalPriceFull,
): StockProviderPriceHistory => ({
  symbol: normalizeProviderSymbol(raw.symbol),
  currency: "USD",
  points: mapHistoricalPoints(raw.historical ?? []),
});

/** Stable API returns a flat array for historical-price-eod/full. */
export const mapFmpStableHistoricalPricesToStockProvider = (
  symbol: string,
  points: FmpHistoricalPricePoint[],
): StockProviderPriceHistory => ({
  symbol: normalizeProviderSymbol(symbol),
  currency: "USD",
  points: mapHistoricalPoints(points),
});

export const mapFmpNewsToStockProviderNews = (
  raw: FmpStockNews[],
): StockProviderNewsItem[] =>
  raw.map((item, index) => ({
    id: `${normalizeProviderSymbol(item.symbol)}-fmp-${index}-${item.publishedDate}`,
    symbol: normalizeProviderSymbol(item.symbol),
    title: item.title,
    summary: item.text,
    source: item.site,
    url: item.url,
    publishedAt: item.publishedDate,
    imageUrl: item.image,
  }));

const mapEarningsTime = (time?: string): StockProviderEarningsTime => {
  const lower = time?.toLowerCase() ?? "";
  if (lower.includes("bmo") || lower.includes("before")) {
    return "beforeMarket";
  }
  if (lower.includes("amc") || lower.includes("after")) {
    return "afterMarket";
  }
  return "unknown";
};

export const mapFmpEarningsToStockProvider = (
  raw: FmpEarningCalendar[],
  companyName: string,
): StockProviderEarningsEvent[] =>
  raw.map((item) => ({
    symbol: normalizeProviderSymbol(item.symbol),
    companyName,
    date: item.date,
    time: mapEarningsTime(item.time),
    epsEstimate: item.epsEstimated,
    revenueEstimate: item.revenueEstimated,
    source: "fmp",
    impact: "medium" as StockProviderEarningsImpact,
  }));

export const mapFmpGradesConsensusToDistribution = (
  grades: FmpGradesConsensus,
): StockProviderAnalystDistribution => ({
  buy: (grades.strongBuy ?? 0) + (grades.buy ?? 0),
  hold: grades.hold ?? 0,
  sell: (grades.sell ?? 0) + (grades.strongSell ?? 0),
});

const mapGradesConsensusToAnalystConsensus = (
  grades: FmpGradesConsensus,
): StockProviderAnalystConsensus => {
  const distribution = mapFmpGradesConsensusToDistribution(grades);
  const total = distribution.buy + distribution.hold + distribution.sell;
  if (total === 0) {
    return "mixed";
  }
  if (distribution.buy > distribution.hold && distribution.buy > distribution.sell) {
    return "buy";
  }
  if (distribution.sell > distribution.buy && distribution.sell > distribution.hold) {
    return "sell";
  }
  if (distribution.hold >= distribution.buy && distribution.hold >= distribution.sell) {
    return "hold";
  }
  return "mixed";
};

const mapSummaryConsensus = (summary: FmpPriceTargetSummary): StockProviderAnalystConsensus => {
  const avg = summary.allTimeAvgPriceTarget ?? summary.lastYearAvgPriceTarget;
  if (!avg) {
    return "mixed";
  }
  return "buy";
};

export const mapFmpIntradayBarsToHistory = (
  symbol: string,
  bars: FmpIntradayBar[],
): StockProviderIntradayHistory | null => {
  if (!bars.length) {
    return null;
  }

  const points = bars
    .filter((bar) => bar.close > 0)
    .map((bar) => {
      let timeLabel = bar.date;
      try {
        const parsed = parseISO(bar.date.replace(" ", "T"));
        timeLabel = format(parsed, "HH:mm");
      } catch {
        timeLabel = bar.date.slice(11, 16) || bar.date;
      }
      return {
        time: timeLabel,
        price: bar.close,
      };
    });

  if (points.length === 0) {
    return null;
  }

  return {
    symbol: normalizeProviderSymbol(symbol),
    currency: "USD",
    points,
  };
};

export const mapFmpAnalystTargetToStockProvider = (input: {
  symbol: string;
  currentPrice: number;
  summary?: FmpPriceTargetSummary | null;
  consensus?: FmpPriceTargetConsensus | null;
  grades?: FmpGradesConsensus | null;
}): StockProviderAnalystTarget | null => {
  const { symbol, currentPrice, summary, consensus, grades } = input;

  const averageTarget =
    consensus?.targetConsensus ??
    consensus?.targetMedian ??
    summary?.allTimeAvgPriceTarget ??
    summary?.lastYearAvgPriceTarget ??
    summary?.lastQuarterAvgPriceTarget;

  if (!averageTarget || currentPrice <= 0) {
    return null;
  }

  const spread = averageTarget * 0.15;
  const highTarget =
    consensus?.targetHigh ?? Number((averageTarget + spread).toFixed(2));
  const lowTarget =
    consensus?.targetLow ?? Number(Math.max(averageTarget - spread, 0).toFixed(2));
  const upsidePercent = Number(
    (((averageTarget - currentPrice) / currentPrice) * 100).toFixed(1),
  );

  const distribution = grades ? mapFmpGradesConsensusToDistribution(grades) : undefined;
  const analystConsensus = grades
    ? mapGradesConsensusToAnalystConsensus(grades)
    : summary
      ? mapSummaryConsensus(summary)
      : "mixed";

  const analystCount = grades
    ? distribution
      ? distribution.buy + distribution.hold + distribution.sell
      : undefined
    : summary?.allTime ?? summary?.lastYear;

  return {
    symbol: normalizeProviderSymbol(symbol),
    averageTarget: Number(averageTarget.toFixed(2)),
    highTarget: Number(highTarget.toFixed(2)),
    lowTarget: Number(lowTarget.toFixed(2)),
    upsidePercent,
    consensus: analystConsensus,
    analystCount,
    distribution,
    updatedAt: new Date().toISOString(),
  };
};

/** @deprecated Use mapFmpAnalystTargetToStockProvider */
export const mapFmpPriceTargetToStockProvider = (
  summary: FmpPriceTargetSummary,
  currentPrice: number,
): StockProviderAnalystTarget | null =>
  mapFmpAnalystTargetToStockProvider({
    symbol: summary.symbol,
    currentPrice,
    summary,
  });
