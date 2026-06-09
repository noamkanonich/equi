import "server-only";

import type { StockProviderQuote } from "@/data/financial-data/financial-data.types";
import type { Quote } from "@/data/market/quote.types";

export const mapQuoteToStockProviderQuote = (
  quote: Quote,
  symbol: string,
): StockProviderQuote | null => {
  if (quote.price === null) {
    return null;
  }

  const change = quote.change ?? 0;
  const changePercent = quote.changePercent ?? 0;
  const previousClose = Number((quote.price - change).toFixed(4));

  return {
    symbol,
    price: quote.price,
    change,
    changePercent,
    previousClose,
    dayHigh: quote.price,
    dayLow: quote.price,
    volume: 0,
    currency: quote.currency,
    updatedAt: quote.asOf,
  };
};
