import type { PortfolioActivity } from "@/data/portfolio/portfolio.types";
import type {
  AllocationSectorDetail,
  AvailableReportItem,
  KeyStatisticItem,
  MonthlySummaryItem,
  PerformanceBenchmarkComparisonItem,
  ReportBenchmarkKey,
  ReportMetricCard,
  ReportPerformancePoint,
  ReportsRiskAiInsight,
  RiskMetricItem,
  TaxLotItem,
  TaxSummaryItem,
} from "./reports.types";

const portfolioPercentTrend = [
  0, 2.1, 3.4, 5.2, 6.8, 8.1, 7.9, 10.2, 12.5, 11.8, 14.2, 15.6, 18.3, 20.1,
  19.5, 22.4, 24.8, 26.2, 25.8, 28.9, 31.2, 30.5, 34.25,
];

const sp500PercentTrend = [
  0, 1.2, 2.1, 3.5, 4.2, 5.1, 4.8, 6.2, 7.8, 7.2, 8.9, 9.5, 11.2, 12.8,
  12.1, 14.2, 15.6, 16.8, 16.2, 18.5, 20.1, 19.4, 22.45,
];

const nasdaqPercentTrend = portfolioPercentTrend.map(
  (value, index) => value * 0.92 + (index % 3) * 0.4,
);

const msciWorldPercentTrend = sp500PercentTrend.map(
  (value, index) => value * 0.88 + (index % 2) * 0.3,
);

const buildPerformancePoints = (
  portfolio: number[],
  benchmark: number[],
): ReportPerformancePoint[] =>
  portfolio.map((portfolioPercent, index) => ({
    date: `2025-${String(Math.floor(index / 2) + 5).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    label: `May ${index + 1}`,
    portfolioPercent: Number(portfolioPercent.toFixed(2)),
    benchmarkPercent: Number(benchmark[index].toFixed(2)),
  }));

export const reportsPerformanceByBenchmark: Record<
  ReportBenchmarkKey,
  ReportPerformancePoint[]
> = {
  sp500: buildPerformancePoints(portfolioPercentTrend, sp500PercentTrend),
  nasdaq: buildPerformancePoints(portfolioPercentTrend, nasdaqPercentTrend),
  msciWorld: buildPerformancePoints(portfolioPercentTrend, msciWorldPercentTrend),
};

export const reportsPeriodMetricSublabelKeys: Record<
  string,
  Record<string, string>
> = {
  portfolioValue: {
    all: "vsAllTime",
    oneYear: "vsLastYear",
    sixMonths: "vsSixMonths",
    threeMonths: "vsThreeMonths",
    thirtyDays: "vsThirtyDays",
  },
  totalGainLoss: {
    all: "fromOriginalInvestment",
    oneYear: "vsLastYear",
    sixMonths: "vsSixMonths",
    threeMonths: "vsThreeMonths",
    thirtyDays: "vsThirtyDays",
  },
};

export const reportsMockMetrics: ReportMetricCard[] = [
  {
    kind: "portfolioValue",
    value: 128450,
    currency: "USD",
    secondaryValue: 14.25,
    secondaryKind: "percent",
    sublabelKey: "vsLastYear",
    trend: [
      111200, 112100, 114150, 116100, 118400, 120450, 122050, 124150, 125430,
      126800, 127200, 128450,
    ],
    tone: "positive",
  },
  {
    kind: "totalGainLoss",
    value: 14250,
    currency: "USD",
    secondaryValue: 12.45,
    secondaryKind: "percent",
    sublabelKey: "fromOriginalInvestment",
    trend: [8200, 9100, 10200, 11400, 12100, 12800, 13400, 13900, 14250],
    tone: "positive",
  },
  {
    kind: "annualReturn",
    value: 14.22,
    currency: "USD",
    secondaryValue: 2.34,
    secondaryKind: "percent",
    sublabelKey: "vsBenchmark",
    sublabelParams: { benchmark: "S&P 500" },
    trend: [8, 9.2, 10.1, 11.4, 12, 12.8, 13.2, 13.8, 14.22],
    tone: "positive",
  },
  {
    kind: "unrealizedGain",
    value: 18730,
    currency: "USD",
    secondaryValue: 17.06,
    secondaryKind: "percent",
    sublabelKey: "fromOriginalInvestment",
    trend: [10200, 11800, 13200, 14800, 15900, 16800, 17500, 18200, 18730],
    tone: "positive",
  },
  {
    kind: "cashBalance",
    value: 8250,
    currency: "USD",
    secondaryValue: 6.4,
    secondaryKind: "percent",
    sublabelKey: "ofPortfolio",
    trend: [7200, 7400, 7600, 7800, 7900, 8000, 8100, 8200, 8250],
    tone: "neutral",
  },
];

export const reportsMockKeyStatistics: KeyStatisticItem[] = [
  { key: "bestHolding", value: "NVDA", symbol: "NVDA" },
  { key: "worstHolding", value: "TSLA", symbol: "TSLA" },
  { key: "beta", value: "1.08" },
  { key: "sharpeRatio", value: "1.28" },
  { key: "maxDrawdown", value: "-12.45%" },
  { key: "dividendYield", value: "1.42%" },
];

export const reportsMockMonthlySummary: MonthlySummaryItem[] = [
  { key: "return", value: 3.25, kind: "percent", tone: "positive" },
  { key: "gainLoss", value: 4050, currency: "USD", kind: "money", tone: "positive" },
  { key: "transactions", value: 8, kind: "count", tone: "neutral" },
  { key: "fees", value: -45, currency: "USD", kind: "money", tone: "negative" },
  { key: "dividends", value: 125, currency: "USD", kind: "money", tone: "positive" },
  { key: "netDeposits", value: 2000, currency: "USD", kind: "money", tone: "positive" },
];

export const reportsMockContributors = [
  { symbol: "NVDA", companyName: "NVIDIA Corporation", contributionAmount: 5240, contributionPercent: 36.8 },
  { symbol: "MSFT", companyName: "Microsoft Corporation", contributionAmount: 3180, contributionPercent: 22.3 },
  { symbol: "AAPL", companyName: "Apple Inc.", contributionAmount: 2140, contributionPercent: 15.0 },
  { symbol: "GOOGL", companyName: "Alphabet Inc.", contributionAmount: 1820, contributionPercent: 12.8 },
  { symbol: "TSLA", companyName: "Tesla, Inc.", contributionAmount: -640, contributionPercent: -4.5 },
  { symbol: "CASH", companyName: "Cash", contributionAmount: 410, contributionPercent: 2.9, isCash: true },
];

export const reportsAvailableReports: AvailableReportItem[] = [
  { id: "performance", nameKey: "performanceReport", fileType: "pdf" },
  { id: "allocation", nameKey: "allocationReport", fileType: "pdf" },
  { id: "risk", nameKey: "riskReport", fileType: "pdf" },
  { id: "tax", nameKey: "taxReport", fileType: "pdf" },
  { id: "holdings", nameKey: "holdingsReport", fileType: "csv" },
];

export const reportsMockSummary = {
  totalValue: 128450,
  todayChange: 2865.47,
  todayChangePercent: 2.35,
  totalReturn: 14250,
  totalReturnPercent: 12.45,
  cashAvailable: 8250,
  portfolioScore: 72,
  currency: "USD" as const,
};

export const reportsMockAllocation = [
  { key: "technology" as const, percent: 68.5, value: 87988 },
  { key: "communication" as const, percent: 15.2, value: 19524 },
  { key: "cash" as const, percent: 6.4, value: 8221 },
  { key: "consumerCyclical" as const, percent: 5.6, value: 7193 },
  { key: "healthcare" as const, percent: 2.3, value: 2954 },
  { key: "consumerDefensive" as const, percent: 2.0, value: 2570 },
];

export const reportsMockAllocationSectorDetails: AllocationSectorDetail[] = [
  {
    key: "technology",
    percent: 68.5,
    value: 87988,
    holdings: [
      { symbol: "NVDA", companyName: "NVIDIA Corporation", weightPercent: 17.2, sectorWeightPercent: 25.1 },
      { symbol: "MSFT", companyName: "Microsoft Corporation", weightPercent: 38.4, sectorWeightPercent: 56.1 },
      { symbol: "AAPL", companyName: "Apple Inc.", weightPercent: 12.9, sectorWeightPercent: 18.8 },
    ],
  },
  {
    key: "communication",
    percent: 15.2,
    value: 19524,
    holdings: [
      { symbol: "GOOGL", companyName: "Alphabet Inc.", weightPercent: 15.2, sectorWeightPercent: 100 },
    ],
  },
  {
    key: "cash",
    percent: 6.4,
    value: 8221,
    holdings: [],
  },
  {
    key: "consumerCyclical",
    percent: 5.6,
    value: 7193,
    holdings: [
      { symbol: "TSLA", companyName: "Tesla, Inc.", weightPercent: 5.6, sectorWeightPercent: 100 },
    ],
  },
  {
    key: "healthcare",
    percent: 2.3,
    value: 2954,
    holdings: [
      { symbol: "JNJ", companyName: "Johnson & Johnson", weightPercent: 2.3, sectorWeightPercent: 100 },
    ],
  },
  {
    key: "consumerDefensive",
    percent: 2.0,
    value: 2570,
    holdings: [
      { symbol: "PG", companyName: "Procter & Gamble", weightPercent: 2.0, sectorWeightPercent: 100 },
    ],
  },
];

export const reportsMockBenchmarkComparisons: PerformanceBenchmarkComparisonItem[] = [
  { key: "sp500", returnPercent: 22.45, deltaVsPortfolio: -11.8, tone: "positive" },
  { key: "nasdaq", returnPercent: 26.1, deltaVsPortfolio: -8.15, tone: "positive" },
  { key: "msciWorld", returnPercent: 18.9, deltaVsPortfolio: -15.35, tone: "positive" },
];

export const reportsMockActivities: PortfolioActivity[] = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    logoUrl: null,
    type: "buy",
    date: "2026-05-20",
    value: 977.1,
    currency: "USD",
    descriptionKey: "mock.aapl",
    tone: "positive",
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corp.",
    logoUrl: null,
    type: "dividend",
    date: "2026-05-15",
    value: 52.5,
    currency: "USD",
    descriptionKey: "mock.msft",
    tone: "positive",
  },
  {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    logoUrl: null,
    type: "sell",
    date: "2026-05-10",
    value: 357.2,
    currency: "USD",
    descriptionKey: "mock.tsla",
    tone: "negative",
  },
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    logoUrl: null,
    type: "added",
    date: "2026-05-06",
    value: 1024.31,
    currency: "USD",
    descriptionKey: "mock.nvda",
    tone: "positive",
  },
];

export const reportsMockRiskMetrics: RiskMetricItem[] = [
  { key: "beta", value: "1.08", tone: "neutral" },
  { key: "sharpeRatio", value: "1.28", tone: "positive" },
  { key: "sortinoRatio", value: "1.84", tone: "positive" },
  { key: "maxDrawdown", value: "-12.45%", tone: "negative" },
  { key: "volatility", value: "18.2%", tone: "neutral" },
  { key: "valueAtRisk", value: "-2.1%", tone: "neutral" },
  { key: "correlationSP500", value: "0.87", tone: "neutral" },
  { key: "dividendYield", value: "1.42%", tone: "positive" },
];

export const reportsMockRiskAiInsight: ReportsRiskAiInsight = {
  confidencePercent: 72,
  summaryKey: "mock.summary",
  primaryRiskKey: "mock.primaryRisk",
  concentrationRiskKey: "mock.concentrationRisk",
  monitoringSuggestionKey: "mock.monitoringSuggestion",
  riskFactorKeys: [
    "mock.riskFactors.sectorConcentration",
    "mock.riskFactors.elevatedBeta",
    "mock.riskFactors.drawdownExposure",
  ],
};

export const reportsMockTaxSummary: TaxSummaryItem[] = [
  { key: "realizedGains", value: 4820, currency: "USD", kind: "money", tone: "positive" },
  { key: "unrealizedGains", value: 18730, currency: "USD", kind: "money", tone: "positive" },
  { key: "dividendIncome", value: 410, currency: "USD", kind: "money", tone: "positive" },
  { key: "shortTermGains", value: -640, currency: "USD", kind: "money", tone: "negative" },
  { key: "longTermGains", value: 5460, currency: "USD", kind: "money", tone: "positive" },
  { key: "estimatedTax", value: 1092, currency: "USD", kind: "money", tone: "negative" },
];

export const reportsMockTaxLots: TaxLotItem[] = [
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    shares: 12,
    costBasis: 5280,
    currentValue: 13524,
    gainLoss: 8244,
    gainLossPercent: 156.1,
    holdingPeriod: "long",
    acquiredDate: "2023-01-15",
    currency: "USD",
    tone: "positive",
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    shares: 20,
    costBasis: 6400,
    currentValue: 9240,
    gainLoss: 2840,
    gainLossPercent: 44.4,
    holdingPeriod: "long",
    acquiredDate: "2023-06-22",
    currency: "USD",
    tone: "positive",
  },
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    shares: 15,
    costBasis: 2700,
    currentValue: 3285,
    gainLoss: 585,
    gainLossPercent: 21.7,
    holdingPeriod: "long",
    acquiredDate: "2024-02-10",
    currency: "USD",
    tone: "positive",
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    shares: 10,
    costBasis: 1620,
    currentValue: 1970,
    gainLoss: 350,
    gainLossPercent: 21.6,
    holdingPeriod: "long",
    acquiredDate: "2024-03-18",
    currency: "USD",
    tone: "positive",
  },
  {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    shares: 8,
    costBasis: 2240,
    currentValue: 1600,
    gainLoss: -640,
    gainLossPercent: -28.6,
    holdingPeriod: "short",
    acquiredDate: "2025-11-04",
    currency: "USD",
    tone: "negative",
  },
];
