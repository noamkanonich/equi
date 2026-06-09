import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";

export type StockSymbolRegistryEntry = {
  companyName: string;
  logoUrl?: string | null;
  sector?: string;
  defaultPrice?: number;
  exchange?: string;
  assetType?: "stock" | "etf";
};

export const stockSymbolRegistry: Record<string, StockSymbolRegistryEntry> = {
  NVDA: {
    companyName: "NVIDIA Corporation",
    logoUrl: companyProfileLogoUrls.NVDA,
    sector: "technology",
    defaultPrice: 131.38,
    exchange: "NASDAQ",
  },
  AAPL: {
    companyName: "Apple Inc.",
    logoUrl: companyProfileLogoUrls.AAPL,
    sector: "technology",
    defaultPrice: 195.42,
    exchange: "NASDAQ",
  },
  MSFT: {
    companyName: "Microsoft Corporation",
    logoUrl: companyProfileLogoUrls.MSFT,
    sector: "technology",
    defaultPrice: 425.3,
    exchange: "NASDAQ",
  },
  TSLA: {
    companyName: "Tesla, Inc.",
    logoUrl: companyProfileLogoUrls.TSLA,
    sector: "consumerCyclical",
    defaultPrice: 178.95,
    exchange: "NASDAQ",
  },
  GOOGL: {
    companyName: "Alphabet Inc.",
    logoUrl: companyProfileLogoUrls.GOOGL,
    sector: "communication",
    defaultPrice: 168.73,
    exchange: "NASDAQ",
  },
  AMZN: {
    companyName: "Amazon.com, Inc.",
    logoUrl: companyProfileLogoUrls.AMZN,
    sector: "consumerCyclical",
    defaultPrice: 186.21,
    exchange: "NASDAQ",
  },
  META: {
    companyName: "Meta Platforms, Inc.",
    logoUrl: companyProfileLogoUrls.META,
    sector: "communication",
    defaultPrice: 478.16,
    exchange: "NASDAQ",
  },
  AMD: {
    companyName: "Advanced Micro Devices, Inc.",
    logoUrl: companyProfileLogoUrls.AMD,
    sector: "technology",
    defaultPrice: 148.91,
    exchange: "NASDAQ",
  },
  AVGO: {
    companyName: "Broadcom Inc.",
    logoUrl: companyProfileLogoUrls.AVGO,
    sector: "technology",
    defaultPrice: 1402.82,
    exchange: "NASDAQ",
  },
  NFLX: {
    companyName: "Netflix, Inc.",
    sector: "communication",
    defaultPrice: 628.4,
    exchange: "NASDAQ",
  },
  JPM: {
    companyName: "JPMorgan Chase & Co.",
    sector: "financial",
    defaultPrice: 198.5,
    exchange: "NYSE",
  },
  V: {
    companyName: "Visa Inc.",
    sector: "financial",
    defaultPrice: 278.6,
    exchange: "NYSE",
  },
  MA: {
    companyName: "Mastercard Incorporated",
    sector: "financial",
    defaultPrice: 468.2,
    exchange: "NYSE",
  },
  UNH: {
    companyName: "UnitedHealth Group Incorporated",
    sector: "healthcare",
    defaultPrice: 512.8,
    exchange: "NYSE",
  },
  COST: {
    companyName: "Costco Wholesale Corporation",
    sector: "consumerDefensive",
    defaultPrice: 785.2,
    exchange: "NASDAQ",
  },
  LLY: {
    companyName: "Eli Lilly and Company",
    sector: "healthcare",
    defaultPrice: 782.5,
    exchange: "NYSE",
  },
  NKE: {
    companyName: "NIKE, Inc.",
    sector: "consumerCyclical",
    defaultPrice: 98.4,
    exchange: "NYSE",
  },
  DIS: {
    companyName: "The Walt Disney Company",
    sector: "communication",
    defaultPrice: 112.6,
    exchange: "NYSE",
  },
  CRM: {
    companyName: "Salesforce, Inc.",
    sector: "technology",
    defaultPrice: 268.9,
    exchange: "NYSE",
  },
  PLTR: {
    companyName: "Palantir Technologies Inc.",
    sector: "technology",
    defaultPrice: 24.85,
    exchange: "NASDAQ",
  },
  INTC: {
    companyName: "Intel Corporation",
    sector: "technology",
    defaultPrice: 32.15,
    exchange: "NASDAQ",
  },
  QQQ: {
    companyName: "Invesco QQQ Trust",
    sector: "etf",
    defaultPrice: 438.5,
    exchange: "NASDAQ",
    assetType: "etf",
  },
  SPY: {
    companyName: "SPDR S&P 500 ETF Trust",
    sector: "etf",
    defaultPrice: 512.3,
    exchange: "NYSE Arca",
    assetType: "etf",
  },
  VOO: {
    companyName: "Vanguard S&P 500 ETF",
    sector: "etf",
    defaultPrice: 472.8,
    exchange: "NYSE Arca",
    assetType: "etf",
  },
};

export const coreStockSymbols = [
  "NVDA",
  "AAPL",
  "MSFT",
  "TSLA",
  "GOOGL",
  "AMZN",
  "META",
  "AMD",
  "AVGO",
] as const;

export type CoreStockSymbol = (typeof coreStockSymbols)[number];

export const supportedStockSymbols = Object.keys(stockSymbolRegistry);

export const getStockSymbolRegistryEntry = (
  symbol: string,
): StockSymbolRegistryEntry | undefined => stockSymbolRegistry[symbol.toUpperCase()];
