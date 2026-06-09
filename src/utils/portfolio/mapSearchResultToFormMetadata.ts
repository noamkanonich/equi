import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { PortfolioHoldingFormInput } from "@/data/portfolio/portfolio.types";

export const mapSearchResultToFormMetadata = (
  stock: AddStockSearchResult,
): Pick<
  PortfolioHoldingFormInput,
  | "symbol"
  | "assetId"
  | "market"
  | "exchange"
  | "provider"
  | "providerSymbol"
  | "purchaseCurrency"
  | "averageCost"
> => {
  const symbol = stock.symbol.trim().toUpperCase();
  const market = stock.market ?? "US";

  return {
    symbol,
    assetId: stock.assetId ?? `${market}:${symbol}`,
    market,
    exchange: stock.exchange,
    provider: stock.provider ?? (market === "IL" ? "tase" : "fmp"),
    providerSymbol: stock.providerSymbol ?? symbol,
    purchaseCurrency: stock.currency,
    averageCost: stock.price > 0 ? stock.price : 0,
  };
};

export const mergeFormWithSearchResult = (
  current: PortfolioHoldingFormInput,
  stock: AddStockSearchResult,
): PortfolioHoldingFormInput => ({
  ...current,
  ...mapSearchResultToFormMetadata(stock),
});
