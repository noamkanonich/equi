import type {
  ScoreLabelKey,
  StockAnalysisData,
  StockChartPoint,
  StockChartRange,
  StockNewsItem,
} from "./stock-analysis.types";
import { mapScoreToLabelKey } from "@/utils/stocks/mappers";

const intradayLabels = [
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const monthLabels = ["W1", "W2", "W3", "W4"];
const yearLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const maxLabels = ["2020", "2021", "2022", "2023", "2024", "2025"];

const buildIntradayChart = (
  open: number,
  close: number,
  labels: string[],
): StockChartPoint[] => {
  const step = (close - open) / (labels.length - 1);
  return labels.map((label, index) => ({
    label,
    price: Number((open + step * index + Math.sin(index * 0.8) * 2).toFixed(2)),
  }));
};

const buildTrendChart = (
  start: number,
  end: number,
  count: number,
  labelFn: (index: number) => string,
): StockChartPoint[] => {
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, index) => ({
    label: labelFn(index),
    price: Number(
      (start + step * index + Math.sin(index * 0.5) * (end * 0.008)).toFixed(2),
    ),
  }));
};

export const buildChartData = (
  currentPrice: number,
  previousClose: number,
): Record<StockChartRange, StockChartPoint[]> => ({
  oneDay: buildIntradayChart(previousClose, currentPrice, intradayLabels),
  oneWeek: buildTrendChart(previousClose * 0.98, currentPrice, 5, (i) => weekLabels[i]),
  oneMonth: buildTrendChart(previousClose * 0.95, currentPrice, 4, (i) => monthLabels[i]),
  oneYear: buildTrendChart(previousClose * 0.72, currentPrice, 12, (i) => yearLabels[i]),
  max: buildTrendChart(previousClose * 0.15, currentPrice, 6, (i) => maxLabels[i]),
});

export const defaultScoreBreakdown = (
  overrides: Partial<
    Record<
      | "growth"
      | "profitability"
      | "valuation"
      | "financialHealth"
      | "momentum"
      | "analystSentiment",
      { score: number; labelKey: ScoreLabelKey; sparkline: number[] }
    >
  > = {},
) => {
  const defaults = {
    growth: { score: 80, labelKey: "strong" as const, sparkline: [70, 72, 75, 78, 80, 82, 85] },
    profitability: {
      score: 78,
      labelKey: "strong" as const,
      sparkline: [68, 70, 72, 74, 76, 78, 80],
    },
    valuation: { score: 65, labelKey: "good" as const, sparkline: [60, 62, 63, 64, 65, 66, 65] },
    financialHealth: {
      score: 82,
      labelKey: "veryStrong" as const,
      sparkline: [75, 76, 78, 79, 80, 81, 82],
    },
    momentum: {
      score: 84,
      labelKey: "veryStrong" as const,
      sparkline: [72, 74, 76, 80, 82, 83, 84],
    },
    analystSentiment: {
      score: 72,
      labelKey: "good" as const,
      sparkline: [65, 66, 68, 70, 71, 72, 73],
    },
  };

  const merged = { ...defaults, ...overrides };

  return [
    { category: "growth" as const, ...merged.growth },
    { category: "profitability" as const, ...merged.profitability },
    { category: "valuation" as const, ...merged.valuation },
    { category: "financialHealth" as const, ...merged.financialHealth },
    { category: "momentum" as const, ...merged.momentum },
    { category: "analystSentiment" as const, ...merged.analystSentiment },
  ];
};

export const buildMockNewsItems = (symbol: string): StockNewsItem[] => {
  const symbolLower = symbol.toLowerCase();
  const categories: StockNewsItem["category"][] = ["earnings", "analysis", "news"];

  return [1, 2, 3].map((item) => ({
    id: `${symbolLower}-news-${item}`,
    titleKey: `mock.${symbolLower}.news.item${item}.title`,
    sourceKey: `mock.${symbolLower}.news.item${item}.source`,
    timeAgoKey: `mock.${symbolLower}.news.item${item}.timeAgo`,
    category: categories[item - 1],
  }));
};

export const resolveScoreLabelKey = (
  overallScore: number,
  override?: ScoreLabelKey,
): ScoreLabelKey => override ?? mapScoreToLabelKey(overallScore);

export type StockMockOverrides = Partial<
  Omit<StockAnalysisData, "symbol" | "fundamentals">
> & {
  fundamentals?: StockAnalysisData["fundamentals"];
};
