import type {
  FinancialDataProviderId,
  StockProviderAnalystTarget,
  StockProviderEarningsEvent,
  StockProviderFinancialStatement,
  StockProviderKeyMetrics,
  StockProviderNewsItem,
  StockProviderIntradayHistory,
  StockProviderPriceHistory,
  StockProviderProfile,
  StockProviderQuote,
} from "@/data/financial-data/financial-data.types";

export type StockDataProvider = {
  id: FinancialDataProviderId;
  fetchProfile: (symbol: string) => Promise<StockProviderProfile | null>;
  fetchQuote: (symbol: string) => Promise<StockProviderQuote | null>;
  fetchKeyMetrics: (symbol: string) => Promise<StockProviderKeyMetrics | null>;
  fetchIncomeStatements: (
    symbol: string,
  ) => Promise<StockProviderFinancialStatement[]>;
  fetchCashFlowStatements: (
    symbol: string,
  ) => Promise<StockProviderFinancialStatement[]>;
  fetchPriceHistory: (symbol: string) => Promise<StockProviderPriceHistory | null>;
  fetchIntradayHistory?: (symbol: string) => Promise<StockProviderIntradayHistory | null>;
  fetchNews?: (symbol: string) => Promise<StockProviderNewsItem[]>;
  fetchEarnings?: (
    symbol: string,
    context?: { profile?: StockProviderProfile | null },
  ) => Promise<StockProviderEarningsEvent[]>;
  fetchAnalystTarget?: (
    symbol: string,
    context?: { quote?: StockProviderQuote | null },
  ) => Promise<StockProviderAnalystTarget | null>;
};
