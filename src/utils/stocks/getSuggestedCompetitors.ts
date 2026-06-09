const COMPETITOR_MAP: Record<string, string[]> = {
  NVDA: ["AMD", "AVGO", "MSFT"],
  AAPL: ["MSFT", "GOOGL", "AMZN"],
  TSLA: ["RIVN", "GM", "F"],
  MSFT: ["GOOGL", "AMZN", "AAPL"],
  GOOGL: ["META", "MSFT", "AMZN"],
  AMZN: ["WMT", "MSFT", "GOOGL"],
  META: ["GOOGL", "SNAP", "PINS"],
  AMD: ["NVDA", "INTC", "AVGO"],
};

const GENERIC_COMPETITORS = ["SPY", "QQQ", "VTI"];

export const getSuggestedCompetitors = (symbol: string): string[] => {
  const normalized = symbol.trim().toUpperCase();
  return COMPETITOR_MAP[normalized] ?? GENERIC_COMPETITORS;
};
