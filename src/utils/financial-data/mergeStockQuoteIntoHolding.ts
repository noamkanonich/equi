import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";

export type StockQuoteEnrichable = {
  symbol: string;
  currentPrice: number;
  dayChangePercent: number;
};

export const mergeStockQuoteIntoHolding = <T extends StockQuoteEnrichable>(
  item: T,
  bundle: StockProviderDataBundle | undefined,
): T => {
  const quote = bundle?.quote;
  if (!quote) {
    return item;
  }

  return {
    ...item,
    currentPrice: quote.price,
    dayChangePercent: quote.changePercent,
  };
};
