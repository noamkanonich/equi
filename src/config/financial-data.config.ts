export const financialDataConfig = {
  useMockStockSearch:
    process.env.USE_MOCK_STOCK_SEARCH === "true" ||
    process.env.NEXT_PUBLIC_USE_MOCK_STOCK_SEARCH === "true",
};
