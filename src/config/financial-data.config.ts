export const financialDataConfig = {
  provider: process.env.FINANCIAL_DATA_PROVIDER?.trim().toLowerCase(),
  allowMockStockSearchFallback: process.env.ALLOW_MOCK_STOCK_SEARCH_FALLBACK === "true",
  useMockStockSearch:
    process.env.USE_MOCK_STOCK_SEARCH === "true" ||
    process.env.NEXT_PUBLIC_USE_MOCK_STOCK_SEARCH === "true",
};
