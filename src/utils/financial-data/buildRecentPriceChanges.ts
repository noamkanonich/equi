import type {
  StockProviderPriceHistory,
  StockProviderPricePoint,
} from "@/data/financial-data/financial-data.types";

type BuildRecentPriceChangesInput = {
  priceHistory?: StockProviderPriceHistory | null;
  currentPrice?: number;
  previousClose?: number;
  updatedAt?: string;
  fallbackCloses?: number[];
  limit?: number;
};

const roundPercent = (value: number): number => Number(value.toFixed(2));

const isPositiveNumber = (value: number | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const sortPricePoints = (
  points: StockProviderPricePoint[],
): StockProviderPricePoint[] =>
  [...points]
    .filter((point) => isPositiveNumber(point.close))
    .sort((firstPoint, secondPoint) =>
      firstPoint.date.localeCompare(secondPoint.date),
    );

const appendCurrentQuoteClose = (
  points: StockProviderPricePoint[],
  input: BuildRecentPriceChangesInput,
): StockProviderPricePoint[] => {
  if (!isPositiveNumber(input.currentPrice)) {
    return points;
  }

  const latestPoint = points.at(-1);
  const quoteDate = input.updatedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  if (
    latestPoint &&
    latestPoint.date >= quoteDate &&
    Math.abs(latestPoint.close - input.currentPrice) < 0.01
  ) {
    return points;
  }

  return [
    ...points,
    {
      date: quoteDate,
      open: input.previousClose ?? input.currentPrice,
      high: Math.max(input.previousClose ?? input.currentPrice, input.currentPrice),
      low: Math.min(input.previousClose ?? input.currentPrice, input.currentPrice),
      close: input.currentPrice,
      volume: 0,
    },
  ];
};

const mapClosesToChanges = (closes: number[], limit: number): number[] => {
  const changes: number[] = [];

  for (let index = 1; index < closes.length; index += 1) {
    const previousClose = closes[index - 1];
    const close = closes[index];

    if (!isPositiveNumber(previousClose) || !isPositiveNumber(close)) {
      continue;
    }

    changes.push(roundPercent(((close - previousClose) / previousClose) * 100));
  }

  return changes.slice(-limit);
};

export const buildRecentPriceChanges = ({
  priceHistory,
  currentPrice,
  previousClose,
  updatedAt,
  fallbackCloses,
  limit = 5,
}: BuildRecentPriceChangesInput): number[] => {
  const historyPoints = sortPricePoints(priceHistory?.points ?? []);
  const pointsWithQuote = appendCurrentQuoteClose(historyPoints, {
    currentPrice,
    previousClose,
    updatedAt,
  });
  const closes =
    pointsWithQuote.length >= 2
      ? pointsWithQuote.map((point) => point.close)
      : (fallbackCloses ?? []);

  return mapClosesToChanges(closes, limit);
};

export const buildRecentCloseTrend = ({
  priceHistory,
  currentPrice,
  fallbackCloses,
  limit = 12,
}: Pick<
  BuildRecentPriceChangesInput,
  "priceHistory" | "currentPrice" | "fallbackCloses" | "limit"
>): number[] => {
  const historyCloses = sortPricePoints(priceHistory?.points ?? []).map(
    (point) => point.close,
  );
  const closes = historyCloses.length > 0 ? historyCloses : (fallbackCloses ?? []);
  const latestClose = closes.at(-1);
  const trend =
    isPositiveNumber(currentPrice) &&
    (!isPositiveNumber(latestClose) || Math.abs(latestClose - currentPrice) >= 0.01)
      ? [...closes, currentPrice]
      : closes;

  return trend.slice(-limit);
};
