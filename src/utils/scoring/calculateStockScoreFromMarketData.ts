import { getMockScoringInputBySymbol } from "@/data/scoring/scoring.mock";
import type {
  OverallScoreResult,
  StockScoringInput,
} from "@/data/scoring/scoring.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { calculateOverallScore } from "./calculateOverallScore";
import { getStockScoreBySymbol } from "./getStockScoreBySymbol";

type CalculateStockScoreFromMarketDataInput = {
  symbol: string;
  companyName?: string;
  bundle?: StockProviderDataBundle;
  dayChangePercent?: number;
  recentDayChanges?: number[];
};

const DEFAULT_FACTOR_SCORE = 60;

const clampScore = (score: number): number =>
  Math.max(0, Math.min(100, Math.round(score)));

const averageScores = (scores: Array<number | undefined>, fallback: number): number => {
  const availableScores = scores.filter(
    (score): score is number =>
      typeof score === "number" && Number.isFinite(score),
  );

  if (availableScores.length === 0) {
    return fallback;
  }

  const average =
    availableScores.reduce((sum, score) => sum + score, 0) / availableScores.length;

  return clampScore(average);
};

const scoreRange = (
  value: number | undefined,
  lowValue: number,
  highValue: number,
  lowScore: number,
  highScore: number,
): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  if (lowValue === highValue) {
    return clampScore(highScore);
  }

  const progress = Math.max(
    0,
    Math.min(1, (value - lowValue) / (highValue - lowValue)),
  );

  return clampScore(lowScore + progress * (highScore - lowScore));
};

const scoreInverseRange = (
  value: number | undefined,
  strongValue: number,
  weakValue: number,
  strongScore: number,
  weakScore: number,
): number | undefined =>
  scoreRange(value, strongValue, weakValue, strongScore, weakScore);

const getTrailingReturnPercent = (
  bundle: StockProviderDataBundle | undefined,
  tradingDays: number,
): number | undefined => {
  const closes =
    bundle?.priceHistory?.points
      .filter((point) => point.close > 0)
      .sort((firstPoint, secondPoint) =>
        firstPoint.date.localeCompare(secondPoint.date),
      )
      .map((point) => point.close) ?? [];

  if (closes.length <= tradingDays) {
    return undefined;
  }

  const currentClose = closes.at(-1);
  const previousClose = closes.at(-(tradingDays + 1));

  if (!currentClose || !previousClose) {
    return undefined;
  }

  return ((currentClose - previousClose) / previousClose) * 100;
};

const buildGrowthScore = (
  input: StockScoringInput,
  bundle: StockProviderDataBundle | undefined,
): number => {
  const metrics = bundle?.keyMetrics;

  return averageScores(
    [
      scoreRange(metrics?.revenueGrowth, -0.1, 0.35, 25, 95),
      scoreRange(metrics?.epsGrowth, -0.15, 0.4, 20, 95),
    ],
    input.growthScore,
  );
};

const buildProfitabilityScore = (
  input: StockScoringInput,
  bundle: StockProviderDataBundle | undefined,
): number => {
  const metrics = bundle?.keyMetrics;

  return averageScores(
    [
      scoreRange(metrics?.grossMargin, 0.25, 0.75, 35, 95),
      scoreRange(metrics?.operatingMargin, 0.05, 0.4, 35, 95),
      scoreRange(metrics?.netMargin, 0.02, 0.32, 30, 95),
      scoreRange(metrics?.roe, 0.05, 0.45, 35, 95),
    ],
    input.profitabilityScore,
  );
};

const buildValuationScore = (
  input: StockScoringInput,
  bundle: StockProviderDataBundle | undefined,
): number => {
  const metrics = bundle?.keyMetrics;

  return averageScores(
    [
      scoreInverseRange(metrics?.peRatio, 12, 70, 92, 20),
      scoreInverseRange(metrics?.pegRatio, 0.8, 4, 92, 25),
      scoreInverseRange(metrics?.priceToSalesRatio, 2, 16, 88, 25),
    ],
    input.valuationScore,
  );
};

const buildFinancialHealthScore = (
  input: StockScoringInput,
  bundle: StockProviderDataBundle | undefined,
): number => {
  const metrics = bundle?.keyMetrics;

  return averageScores(
    [
      scoreInverseRange(metrics?.debtToEquity, 0.2, 3, 92, 25),
      scoreRange(metrics?.currentRatio, 0.8, 2.5, 35, 92),
      scoreRange(metrics?.freeCashFlowPerShare, 0, 20, 45, 92),
    ],
    input.financialHealthScore,
  );
};

const buildMomentumScore = (
  input: StockScoringInput,
  bundle: StockProviderDataBundle | undefined,
  dayChangePercent: number | undefined,
  recentDayChanges: number[] | undefined,
): number => {
  const fiveDayReturn =
    recentDayChanges && recentDayChanges.length > 0
      ? recentDayChanges.reduce(
          (multiplier, change) => multiplier * (1 + change / 100),
          1,
        ) - 1
      : undefined;
  const oneMonthReturn = getTrailingReturnPercent(bundle, 21);

  return averageScores(
    [
      scoreRange(dayChangePercent, -6, 6, 25, 85),
      scoreRange(
        typeof fiveDayReturn === "number" ? fiveDayReturn * 100 : undefined,
        -12,
        12,
        25,
        90,
      ),
      scoreRange(oneMonthReturn, -20, 20, 25, 92),
    ],
    input.momentumScore,
  );
};

const buildAnalystSentimentScore = (
  input: StockScoringInput,
  bundle: StockProviderDataBundle | undefined,
): number => {
  const target = bundle?.analystTarget;
  const distribution = target?.distribution;
  const totalRatings = distribution
    ? distribution.buy + distribution.hold + distribution.sell
    : 0;
  const buyRatio =
    distribution && totalRatings > 0 ? distribution.buy / totalRatings : undefined;

  return averageScores(
    [
      scoreRange(target?.upsidePercent, -20, 35, 25, 92),
      scoreRange(buyRatio, 0.2, 0.85, 35, 92),
    ],
    input.analystSentimentScore,
  );
};

const buildBaseInput = (
  symbol: string,
  companyName?: string,
): StockScoringInput => {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const mockInput = getMockScoringInputBySymbol(normalizedSymbol);

  if (mockInput) {
    return mockInput;
  }

  return {
    symbol: normalizedSymbol,
    companyName: companyName ?? normalizedSymbol,
    growthScore: DEFAULT_FACTOR_SCORE,
    profitabilityScore: DEFAULT_FACTOR_SCORE,
    valuationScore: DEFAULT_FACTOR_SCORE,
    financialHealthScore: DEFAULT_FACTOR_SCORE,
    momentumScore: DEFAULT_FACTOR_SCORE,
    analystSentimentScore: DEFAULT_FACTOR_SCORE,
  };
};

export const calculateStockScoreFromMarketData = ({
  symbol,
  companyName,
  bundle,
  dayChangePercent,
  recentDayChanges,
}: CalculateStockScoreFromMarketDataInput): OverallScoreResult => {
  const baseInput = buildBaseInput(symbol, companyName);

  if (!bundle && !recentDayChanges?.length && typeof dayChangePercent !== "number") {
    return getStockScoreBySymbol(symbol);
  }

  return calculateOverallScore({
    ...baseInput,
    growthScore: buildGrowthScore(baseInput, bundle),
    profitabilityScore: buildProfitabilityScore(baseInput, bundle),
    valuationScore: buildValuationScore(baseInput, bundle),
    financialHealthScore: buildFinancialHealthScore(baseInput, bundle),
    momentumScore: buildMomentumScore(
      baseInput,
      bundle,
      dayChangePercent,
      recentDayChanges,
    ),
    analystSentimentScore: buildAnalystSentimentScore(baseInput, bundle),
  });
};
