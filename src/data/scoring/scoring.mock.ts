import type {
  ScoringFactorKey,
  ScoringFactorMeta,
  ScoringFactorWeights,
  StockScoringInput,
} from "./scoring.types";

export const scoringFactorKeys: ScoringFactorKey[] = [
  "growth",
  "profitability",
  "valuation",
  "financialHealth",
  "momentum",
  "analystSentiment",
];

export const recommendedScoringWeights: ScoringFactorWeights = {
  growth: 25,
  profitability: 20,
  valuation: 20,
  financialHealth: 15,
  momentum: 10,
  analystSentiment: 10,
};

export const scoringFactorMeta: ScoringFactorMeta[] = [
  { key: "growth", impact: "high", accent: "positive" },
  { key: "profitability", impact: "high", accent: "positive" },
  { key: "valuation", impact: "medium", accent: "warning" },
  { key: "financialHealth", impact: "medium", accent: "primary" },
  { key: "momentum", impact: "low", accent: "purple" },
  { key: "analystSentiment", impact: "low", accent: "primary" },
];

export const defaultScoringWeights: ScoringFactorWeights = {
  ...recommendedScoringWeights,
};

export const mockScoringInputs: Record<string, StockScoringInput> = {
  NVDA: {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    growthScore: 94,
    profitabilityScore: 92,
    valuationScore: 68,
    financialHealthScore: 88,
    momentumScore: 91,
    analystSentimentScore: 85,
  },
  AAPL: {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    growthScore: 82,
    profitabilityScore: 92,
    valuationScore: 68,
    financialHealthScore: 88,
    momentumScore: 80,
    analystSentimentScore: 76,
  },
  MSFT: {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    growthScore: 84,
    profitabilityScore: 88,
    valuationScore: 70,
    financialHealthScore: 86,
    momentumScore: 76,
    analystSentimentScore: 80,
  },
  TSLA: {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    growthScore: 62,
    profitabilityScore: 54,
    valuationScore: 38,
    financialHealthScore: 65,
    momentumScore: 42,
    analystSentimentScore: 46,
  },
  GOOGL: {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    growthScore: 62,
    profitabilityScore: 70,
    valuationScore: 54,
    financialHealthScore: 76,
    momentumScore: 48,
    analystSentimentScore: 60,
  },
  AMZN: {
    symbol: "AMZN",
    companyName: "Amazon.com, Inc.",
    growthScore: 68,
    profitabilityScore: 58,
    valuationScore: 62,
    financialHealthScore: 72,
    momentumScore: 60,
    analystSentimentScore: 66,
  },
  META: {
    symbol: "META",
    companyName: "Meta Platforms, Inc.",
    growthScore: 74,
    profitabilityScore: 82,
    valuationScore: 64,
    financialHealthScore: 78,
    momentumScore: 70,
    analystSentimentScore: 72,
  },
  AMD: {
    symbol: "AMD",
    companyName: "Advanced Micro Devices, Inc.",
    growthScore: 78,
    profitabilityScore: 72,
    valuationScore: 58,
    financialHealthScore: 74,
    momentumScore: 68,
    analystSentimentScore: 70,
  },
  AVGO: {
    symbol: "AVGO",
    companyName: "Broadcom Inc.",
    growthScore: 80,
    profitabilityScore: 86,
    valuationScore: 62,
    financialHealthScore: 82,
    momentumScore: 74,
    analystSentimentScore: 78,
  },
};

export const getMockScoringInputBySymbol = (
  symbol: string,
): StockScoringInput | undefined => {
  const normalized = symbol.trim().toUpperCase();
  return mockScoringInputs[normalized];
};
