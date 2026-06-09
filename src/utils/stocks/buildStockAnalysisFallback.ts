import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import type { SuggestedAction } from "@/data/scoring/scoring.types";
import { buildChartData, buildMockNewsItems, defaultScoreBreakdown } from "@/data/stocks/stock-analysis.builders.mock";
import { buildDefaultFundamentals } from "@/utils/stocks/buildStockFundamentals";
import { normalizeStockSymbol } from "@/utils/stocks/mappers";
import { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";
import { mapOverallScoreResultToStockAnalysisOverlay } from "@/utils/scoring/mappers";
import {
  getStockSymbolRegistryEntry,
  type StockSymbolRegistryEntry,
} from "@/utils/stocks/stockSymbolRegistry";

export type StockAnalysisFallbackInput = {
  symbol: string;
  companyName?: string;
  sector?: string;
  currency?: CurrencyCode;
  logoUrl?: string | null;
  currentPrice?: number;
  previousClose?: number;
  overallScore?: number;
  suggestedAction?: SuggestedAction;
  useGenericCopy?: boolean;
};

const resolveRegistry = (
  symbol: string,
  input: StockAnalysisFallbackInput,
): StockSymbolRegistryEntry & { symbol: string } => {
  const normalized = normalizeStockSymbol(symbol);
  const registry = getStockSymbolRegistryEntry(normalized);

  return {
    symbol: normalized,
    companyName: input.companyName ?? registry?.companyName ?? normalized,
    logoUrl: input.logoUrl ?? registry?.logoUrl ?? null,
    sector: input.sector ?? registry?.sector,
    defaultPrice: registry?.defaultPrice ?? 100,
    exchange: registry?.exchange ?? "NASDAQ",
  };
};

export const getStockAnalysisFallback = (
  input: StockAnalysisFallbackInput,
): StockAnalysisData => {
  const normalized = normalizeStockSymbol(input.symbol);
  const registry = resolveRegistry(normalized, input);
  const useGeneric = input.useGenericCopy ?? !getStockSymbolRegistryEntry(normalized);
  const copyPrefix = useGeneric ? "generic" : normalized.toLowerCase();

  const currentPrice = input.currentPrice ?? registry.defaultPrice ?? 100;
  const previousClose =
    input.previousClose ?? Number((currentPrice * 0.985).toFixed(2));
  const dayChange = Number((currentPrice - previousClose).toFixed(2));
  const dayChangePercent = Number(
    ((dayChange / previousClose) * 100).toFixed(2),
  );
  const scoreResult = getStockScoreBySymbol(normalized);
  const scoreOverlay = mapOverallScoreResultToStockAnalysisOverlay(scoreResult);
  const overallScore = input.overallScore ?? scoreOverlay.overallScore;
  const scoreLabelKey = scoreOverlay.scoreLabelKey;
  const suggestedAction: SuggestedAction =
    input.suggestedAction ?? scoreOverlay.suggestedAction;
  const currency = input.currency ?? "USD";

  const fundamentals = buildDefaultFundamentals({
    symbol: normalized,
    aiFundamentalRead: {
      whatsStrongKey: `mock.${copyPrefix}.fundamentals.whatsStrong`,
      riskToWatchKey: `mock.${copyPrefix}.fundamentals.riskToWatch`,
      whatToMonitorKey: `mock.${copyPrefix}.fundamentals.whatToMonitor`,
    },
  });

  const averageTarget = Number((currentPrice * 1.12).toFixed(2));

  return {
    symbol: normalized,
    companyName: registry.companyName,
    logoUrl: registry.logoUrl ?? null,
    exchange: registry.exchange ?? "NASDAQ",
    currentPrice,
    previousClose,
    currency,
    dayChange,
    dayChangePercent,
    lastUpdated: "2024-05-22T14:47:00-04:00",
    overallScore,
    scoreLabelKey,
    suggestedAction,
    confidenceLabelKey: scoreOverlay.confidenceLabelKey,
    scoreBreakdown: scoreOverlay.scoreBreakdown.length
      ? scoreOverlay.scoreBreakdown
      : defaultScoreBreakdown(),
    chartData: buildChartData(currentPrice, previousClose),
    keyMetrics: [
      { kind: "pe", value: 24.5, format: "number" },
      { kind: "peg", value: 1.8, format: "ratio" },
      { kind: "revenueGrowth", value: 8.2, format: "percent" },
      { kind: "grossMargin", value: 42.5, format: "percent" },
      { kind: "operatingMargin", value: 22.4, format: "percent" },
      { kind: "marketCap", value: 500_000_000_000, format: "money", currency },
      { kind: "freeCashFlow", value: 12_000_000_000, format: "money", currency },
      { kind: "debtToEquity", value: 0.45, format: "ratio" },
      { kind: "roe", value: 18.5, format: "percent" },
      { kind: "nextEarnings", value: "2024-06-15", format: "date" },
    ],
    latestNews: buildMockNewsItems(copyPrefix === "generic" ? "generic" : normalized),
    analystTarget: {
      averageTarget,
      upsidePercent: Number(
        (((averageTarget - currentPrice) / currentPrice) * 100).toFixed(1),
      ),
      high: Number((currentPrice * 1.28).toFixed(2)),
      low: Number((currentPrice * 0.82).toFixed(2)),
      consensusKey: overallScore >= 70 ? "buy" : "hold",
      analystCount: 32,
      distribution: { buy: 22, hold: 8, sell: 2 },
    },
    userPosition: null,
    thesisNotes: {
      whyIOwnItKey: `mock.${copyPrefix}.thesis.whyIOwnIt`,
      whatToWatchKey: `mock.${copyPrefix}.thesis.whatToWatch`,
      sellIfKey: `mock.${copyPrefix}.thesis.sellIf`,
    },
    aiInsight: {
      whatsGoodKey: `mock.${copyPrefix}.ai.whatsGood`,
      riskToWatchKey: `mock.${copyPrefix}.ai.riskToWatch`,
      suggestedActionKey: `mock.${copyPrefix}.ai.suggestedAction`,
    },
    fundamentals,
  };
};
