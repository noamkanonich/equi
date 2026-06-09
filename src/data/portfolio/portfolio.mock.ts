import type { PortfolioData, PortfolioHolding } from "./portfolio.types";
import { buildPortfolioData } from "./mappers";
import { enrichPortfolioHoldings } from "@/utils/portfolio/enrichPortfolioHoldings";
import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";
import { portfolioMockQuoteFallbacks } from "./portfolio-quote-fallbacks.mock";

const portfolioValueTrend = [
  111200, 111850, 112100, 112950, 113300, 114150, 114050, 115200, 116100,
  115750, 116900, 117250, 118400, 119350, 119100, 120450, 121300, 122050,
  121850, 123200, 124150, 123850, 125430.75,
];

const todayChangeTrend = [
  220, 460, 390, 680, 740, 610, 920, 1080, 980, 1260, 1180, 1450, 1620, 1540,
  1850, 1975, 1890, 2180, 2360, 2290, 2485, 2670, 2865.47,
];

const totalReturnTrend = [
  11200, 11850, 12100, 12950, 13300, 14150, 14050, 15200, 16100, 15750,
  16900, 17250, 18400, 19350, 19100, 20450, 21300, 22050, 21850, 23200,
  24150, 23850, 21540.32,
];

export const createMockPortfolioHoldingSeed = (
  partial: Omit<PortfolioHolding, "id" | "createdAt" | "updatedAt"> & { id?: string },
): PortfolioHolding => {
  const now = new Date().toISOString();
  return {
    id: partial.id ?? crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
};

export const initialPortfolioHoldings: PortfolioHolding[] = [
  createMockPortfolioHoldingSeed({
    id: "holding-aapl",
    symbol: "AAPL",
    shares: 50,
    averageCost: 179.35,
    purchaseCurrency: "USD",
    purchaseDate: "2024-03-15",
    strategyTag: "core",
  }),
  createMockPortfolioHoldingSeed({
    id: "holding-msft",
    symbol: "MSFT",
    shares: 30,
    averageCost: 370.12,
    purchaseCurrency: "USD",
    purchaseDate: "2024-01-10",
    strategyTag: "core",
  }),
  createMockPortfolioHoldingSeed({
    id: "holding-nvda",
    symbol: "NVDA",
    shares: 200,
    averageCost: 80.05,
    purchaseCurrency: "USD",
    purchaseDate: "2023-11-20",
    strategyTag: "growth",
    targetAllocationPercent: 25,
  }),
  createMockPortfolioHoldingSeed({
    id: "holding-googl",
    symbol: "GOOGL",
    shares: 25,
    averageCost: 172.45,
    purchaseCurrency: "USD",
    purchaseDate: "2024-06-01",
    strategyTag: "growth",
  }),
  createMockPortfolioHoldingSeed({
    id: "holding-amzn",
    symbol: "AMZN",
    shares: 10,
    averageCost: 184.6,
    purchaseCurrency: "USD",
    purchaseDate: "2025-01-05",
    strategyTag: "growth",
  }),
  createMockPortfolioHoldingSeed({
    id: "holding-tsla",
    symbol: "TSLA",
    shares: 15,
    averageCost: 200.67,
    purchaseCurrency: "USD",
    purchaseDate: "2024-08-12",
    strategyTag: "speculative",
  }),
  createMockPortfolioHoldingSeed({
    id: "holding-meta",
    symbol: "META",
    shares: 12,
    averageCost: 464.79,
    purchaseCurrency: "USD",
    purchaseDate: "2024-02-28",
    strategyTag: "core",
  }),
];

const staticSummary = {
  totalValue: 125430.75,
  todayChange: 2865.47,
  todayChangePercent: 2.35,
  totalReturn: 21540.32,
  totalReturnPercent: 20.74,
  cashAvailable: 8230,
  portfolioScore: 72,
  currency: "USD" as const,
};

const enrichedSeedHoldings = enrichPortfolioHoldings(
  initialPortfolioHoldings,
  {},
  portfolioMockQuoteFallbacks,
);

export const portfolioMockData: PortfolioData = buildPortfolioData({
  summary: staticSummary,
  metricTrends: {
    totalValue: portfolioValueTrend,
    todayChange: todayChangeTrend,
    totalReturn: totalReturnTrend,
  },
  holdings: enrichedSeedHoldings,
  performance: portfolioValueTrend.map((value, index) => ({
    date: `2026-05-${String(index + 1).padStart(2, "0")}`,
    label: `May ${index + 1}`,
    value,
    currency: "USD",
    range:
      index < 2
        ? "oneDay"
        : index < 7
          ? "oneWeek"
          : index < 18
            ? "oneMonth"
            : index < 22
              ? "oneYear"
              : "all",
  })),
  upcomingEarnings: [
    {
      symbol: "NVDA",
      companyName: "NVIDIA Corporation",
      logoUrl: companyProfileLogoUrls.NVDA,
      date: "2026-06-04",
      timing: "afterMarket",
    },
    {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      logoUrl: companyProfileLogoUrls.AAPL,
      date: "2026-06-12",
      timing: "afterMarket",
    },
    {
      symbol: "MSFT",
      companyName: "Microsoft Corp.",
      logoUrl: companyProfileLogoUrls.MSFT,
      date: "2026-06-18",
      timing: "afterMarket",
    },
    {
      symbol: "AMZN",
      companyName: "Amazon.com, Inc.",
      logoUrl: companyProfileLogoUrls.AMZN,
      date: "2026-06-24",
      timing: "beforeMarket",
    },
  ],
  recentActivity: [
    {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      logoUrl: companyProfileLogoUrls.AAPL,
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
      logoUrl: companyProfileLogoUrls.MSFT,
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
      logoUrl: companyProfileLogoUrls.TSLA,
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
      logoUrl: companyProfileLogoUrls.NVDA,
      type: "added",
      date: "2026-05-06",
      value: 1024.31,
      currency: "USD",
      descriptionKey: "mock.nvda",
      tone: "positive",
    },
  ],
  aiInsight: {
    confidencePercent: 78,
    keyPositiveKey: "ai.mock.keyPositive",
    potentialConcernKey: "ai.mock.potentialConcern",
    suggestedReviewKey: "ai.mock.suggestedReview",
  },
});

export const initialPortfolioCashBalance = {
  amount: staticSummary.cashAvailable,
  currency: staticSummary.currency,
};
