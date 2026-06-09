import type { CurrencyCode } from "@/data/currencies/currency.types";
import {
  buildFinancialDataMeta,
  normalizeProviderSymbol,
} from "@/data/financial-data/mappers";
import type {
  FinancialDataSection,
  StockProviderAnalystTarget,
  StockProviderDataBundle,
  StockProviderEarningsEvent,
  StockProviderFinancialStatement,
  StockProviderIntradayHistory,
  StockProviderKeyMetrics,
  StockProviderNewsItem,
  StockProviderPriceHistory,
  StockProviderProfile,
  StockProviderQuote,
} from "@/data/financial-data/financial-data.types";
import { getStockSymbolRegistryEntry } from "@/utils/stocks/stockSymbolRegistry";
import { isMockSearchCatalogSymbol } from "@/data/stocks/stock-search.mock";

const DEFAULT_CURRENCY: CurrencyCode = "USD";

const resolveRegistry = (symbol: string) => {
  const normalized = normalizeProviderSymbol(symbol);
  const registry = getStockSymbolRegistryEntry(normalized);
  return {
    symbol: normalized,
    companyName: registry?.companyName ?? normalized,
    logoUrl: registry?.logoUrl ?? null,
    sector: registry?.sector,
    exchange: registry?.exchange ?? "NASDAQ",
    defaultPrice: registry?.defaultPrice ?? 100,
  };
};

export const mockStockProfile = (symbol: string): StockProviderProfile => {
  const registry = resolveRegistry(symbol);
  return {
    symbol: registry.symbol,
    companyName: registry.companyName,
    exchange: registry.exchange,
    sector: registry.sector,
    logoUrl: registry.logoUrl,
    currency: DEFAULT_CURRENCY,
    marketCap: registry.defaultPrice * 1_000_000_000,
    beta: 1.1,
    country: "US",
  };
};

export const mockStockQuote = (symbol: string): StockProviderQuote => {
  const registry = resolveRegistry(symbol);
  const price = registry.defaultPrice;
  const previousClose = Number((price * 0.985).toFixed(2));
  const change = Number((price - previousClose).toFixed(2));
  const changePercent = Number(((change / previousClose) * 100).toFixed(2));

  return {
    symbol: registry.symbol,
    price,
    change,
    changePercent,
    previousClose,
    dayHigh: Number((price * 1.02).toFixed(2)),
    dayLow: Number((price * 0.98).toFixed(2)),
    volume: 45_000_000,
    marketCap: price * 1_000_000_000,
    currency: DEFAULT_CURRENCY,
    updatedAt: new Date().toISOString(),
    isMarketOpen: true,
  };
};

export const mockKeyMetrics = (symbol: string): StockProviderKeyMetrics => {
  const registry = resolveRegistry(symbol);
  return {
    symbol: registry.symbol,
    currency: DEFAULT_CURRENCY,
    asOfDate: new Date().toISOString().slice(0, 10),
    peRatio: 28.5,
    pegRatio: 1.4,
    priceToSalesRatio: 8.2,
    marketCap: registry.defaultPrice * 1_000_000_000,
    roe: 0.42,
    debtToEquity: 0.35,
    grossMargin: 0.65,
    operatingMargin: 0.38,
    netMargin: 0.32,
    revenueGrowth: 0.18,
    epsGrowth: 0.22,
  };
};

const buildMockStatementYears = (): number[] => {
  const year = new Date().getFullYear();
  return [year - 4, year - 3, year - 2, year - 1, year];
};

export const mockIncomeStatements = (
  symbol: string,
): StockProviderFinancialStatement[] => {
  const registry = resolveRegistry(symbol);
  const baseRevenue = registry.defaultPrice * 10_000_000;

  return buildMockStatementYears().map((fiscalYear, index) => {
    const growth = 1 + index * 0.12;
    const revenue = baseRevenue * growth;
    return {
      symbol: registry.symbol,
      period: `FY${fiscalYear}`,
      fiscalYear,
      statementType: "income" as const,
      revenue,
      grossProfit: revenue * 0.62,
      operatingIncome: revenue * 0.28,
      netIncome: revenue * 0.22,
      eps: Number((registry.defaultPrice * 0.01 * growth).toFixed(2)),
      currency: DEFAULT_CURRENCY,
    };
  });
};

export const mockCashFlowStatements = (
  symbol: string,
): StockProviderFinancialStatement[] => {
  const registry = resolveRegistry(symbol);
  const baseRevenue = registry.defaultPrice * 10_000_000;

  return buildMockStatementYears().map((fiscalYear, index) => {
    const growth = 1 + index * 0.1;
    const revenue = baseRevenue * growth;
    return {
      symbol: registry.symbol,
      period: `FY${fiscalYear}`,
      fiscalYear,
      statementType: "cashFlow" as const,
      operatingCashFlow: revenue * 0.3,
      freeCashFlow: revenue * 0.22,
      currency: DEFAULT_CURRENCY,
    };
  });
};

export const mockPriceHistory = (symbol: string): StockProviderPriceHistory => {
  const registry = resolveRegistry(symbol);
  const points = Array.from({ length: 252 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (251 - index));
    const drift = registry.defaultPrice * (0.85 + (index / 251) * 0.2);
    const noise = Math.sin(index * 0.15) * registry.defaultPrice * 0.02;
    const close = Number((drift + noise).toFixed(2));
    return {
      date: date.toISOString().slice(0, 10),
      open: Number((close * 0.995).toFixed(2)),
      high: Number((close * 1.01).toFixed(2)),
      low: Number((close * 0.99).toFixed(2)),
      close,
      volume: 30_000_000 + index * 50_000,
    };
  });

  return {
    symbol: registry.symbol,
    currency: DEFAULT_CURRENCY,
    points,
  };
};

export const mockNews = (symbol: string): StockProviderNewsItem[] => {
  const registry = resolveRegistry(symbol);
  const now = Date.now();

  return [
    {
      id: `${registry.symbol}-news-1`,
      symbol: registry.symbol,
      title: `${registry.companyName} reports quarterly results`,
      summary: "Revenue and earnings beat analyst expectations in the latest quarter.",
      source: "Equi Mock Wire",
      url: "https://example.com/news/1",
      publishedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
    },
    {
      id: `${registry.symbol}-news-2`,
      symbol: registry.symbol,
      title: `Analysts revisit outlook on ${registry.symbol}`,
      summary: "Several firms updated price targets following recent sector moves.",
      source: "Equi Mock Research",
      url: "https://example.com/news/2",
      publishedAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral",
    },
    {
      id: `${registry.symbol}-news-3`,
      symbol: registry.symbol,
      title: `${registry.companyName} faces supply chain headwinds`,
      summary: "Management noted margin pressure may persist near term.",
      source: "Equi Mock Daily",
      url: "https://example.com/news/3",
      publishedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      sentiment: "negative",
    },
  ];
};

export const mockEarnings = (symbol: string): StockProviderEarningsEvent[] => {
  const registry = resolveRegistry(symbol);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 14);

  return [
    {
      symbol: registry.symbol,
      companyName: registry.companyName,
      date: nextDate.toISOString().slice(0, 10),
      time: "afterMarket",
      epsEstimate: 2.45,
      revenueEstimate: 28_500_000_000,
      source: "mock",
      impact: "high",
    },
  ];
};

export const mockAnalystTarget = (symbol: string): StockProviderAnalystTarget => {
  const registry = resolveRegistry(symbol);
  const quote = mockStockQuote(symbol);
  const averageTarget = Number((quote.price * 1.12).toFixed(2));
  const highTarget = Number((quote.price * 1.28).toFixed(2));
  const lowTarget = Number((quote.price * 0.95).toFixed(2));
  const upsidePercent = Number(
    (((averageTarget - quote.price) / quote.price) * 100).toFixed(1),
  );

  return {
    symbol: registry.symbol,
    averageTarget,
    highTarget,
    lowTarget,
    upsidePercent,
    consensus: "buy",
    analystCount: 32,
    distribution: { buy: 24, hold: 6, sell: 2 },
    updatedAt: new Date().toISOString(),
  };
};

export const mockIntradayHistory = (
  symbol: string,
): StockProviderIntradayHistory | null => {
  const quote = mockStockQuote(symbol);
  const labels = [
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
  const step = (quote.price - quote.previousClose) / (labels.length - 1);

  return {
    symbol: normalizeProviderSymbol(symbol),
    currency: quote.currency,
    points: labels.map((time, index) => ({
      time,
      price: Number((quote.previousClose + step * index).toFixed(2)),
    })),
  };
};

const ALL_SECTIONS: FinancialDataSection[] = [
  "profile",
  "quote",
  "keyMetrics",
  "incomeStatements",
  "cashFlowStatements",
  "priceHistory",
  "intraday",
  "news",
  "earnings",
  "analystTarget",
];

export const buildMockStockDataBundle = (symbol: string): StockProviderDataBundle => {
  const normalized = normalizeProviderSymbol(symbol);
  const isCatalogSymbol = isMockSearchCatalogSymbol(normalized);
  const displaySections: FinancialDataSection[] = isCatalogSymbol
    ? ["quote", "profile"]
    : ALL_SECTIONS;
  const missingSections: FinancialDataSection[] = isCatalogSymbol
    ? ALL_SECTIONS.filter((section) => !displaySections.includes(section))
    : [];

  return {
    symbol: normalized,
    profile: mockStockProfile(normalized),
    quote: mockStockQuote(normalized),
    keyMetrics: isCatalogSymbol ? null : mockKeyMetrics(normalized),
    incomeStatements: isCatalogSymbol ? [] : mockIncomeStatements(normalized),
    cashFlowStatements: isCatalogSymbol ? [] : mockCashFlowStatements(normalized),
    priceHistory: isCatalogSymbol ? null : mockPriceHistory(normalized),
    intraday: isCatalogSymbol ? null : mockIntradayHistory(normalized),
    news: isCatalogSymbol ? [] : mockNews(normalized),
    earnings: isCatalogSymbol ? [] : mockEarnings(normalized),
    analystTarget: isCatalogSymbol ? null : mockAnalystTarget(normalized),
    analystRatings: [],
    meta: buildFinancialDataMeta({
      provider: "mock",
      source: "mock",
      isFallback: true,
      fallbackReason: isCatalogSymbol ? "mockSearchData" : undefined,
      availableDataSections: displaySections,
      missingDataSections: missingSections,
    }),
  };
};
