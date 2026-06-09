import { format, subYears } from "date-fns";

/** FMP stable API — required for keys created after legacy v3 retirement (Aug 2025). */
const FMP_STABLE_BASE_URL = "https://financialmodelingprep.com/stable";

const buildStableUrl = (
  path: string,
  params: Record<string, string | number>,
): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    search.set(key, String(value));
  });
  return `${FMP_STABLE_BASE_URL}/${path}?${search.toString()}`;
};

const historicalFromTo = (): { from: string; to: string } => {
  const to = new Date();
  const from = subYears(to, 1);
  return {
    from: format(from, "yyyy-MM-dd"),
    to: format(to, "yyyy-MM-dd"),
  };
};

export const fmpEndpoints = {
  profile: (symbol: string) => buildStableUrl("profile", { symbol }),

  quote: (symbol: string) => buildStableUrl("quote", { symbol }),

  keyMetrics: (symbol: string) =>
    buildStableUrl("key-metrics", { symbol, limit: 1 }),

  incomeStatement: (symbol: string) =>
    buildStableUrl("income-statement", {
      symbol,
      limit: 5,
      period: "annual",
    }),

  cashFlowStatement: (symbol: string) =>
    buildStableUrl("cash-flow-statement", {
      symbol,
      limit: 5,
      period: "annual",
    }),

  historicalPriceFull: (symbol: string) => {
    const { from, to } = historicalFromTo();
    return buildStableUrl("historical-price-eod/full", { symbol, from, to });
  },

  stockNews: (symbol: string) =>
    buildStableUrl("news/stock", { symbols: symbol, limit: 5 }),

  earningCalendar: (symbol: string) =>
    buildStableUrl("earnings", { symbol }),

  priceTargetSummary: (symbol: string) =>
    buildStableUrl("price-target-summary", { symbol }),

  searchSymbol: (query: string) =>
    buildStableUrl("search-symbol", { query, limit: 20 }),

  searchName: (query: string) => buildStableUrl("search-name", { query, limit: 20 }),

  gradesConsensus: (symbol: string) => buildStableUrl("grades-consensus", { symbol }),

  priceTargetConsensus: (symbol: string) =>
    buildStableUrl("price-target-consensus", { symbol }),

  historicalChart5Min: (symbol: string, from: string, to: string) =>
    buildStableUrl("historical-chart/5min", { symbol, from, to }),
} as const;
