"use client";

import { useMemo } from "react";
import { useAppData } from "@/providers/useAppData";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import { derivePageFreshnessStatus } from "@/utils/financial-data/derivePageFreshnessStatus";

type UseLivePortfolioDataOptions = {
  extraSymbols?: string[];
};

/**
 * Read-only portfolio display data from AppDataProvider.
 * Does not trigger fetches — startup prefetch is handled by AppDataProvider.
 */
export const useLivePortfolioData = (options: UseLivePortfolioDataOptions = {}) => {
  const { extraSymbols = [] } = options;
  const {
    portfolioHoldings: userHoldings,
    cashBalance,
    stockDataBySymbol,
    stockDataLoadingBySymbol,
    enrichedPortfolioHoldings,
    portfolioSummary,
  } = useAppData();

  const portfolioSymbols = useMemo(
    () => collectUniqueSymbols(userHoldings.map((holding) => holding.symbol)),
    [userHoldings],
  );

  const symbols = useMemo(
    () => collectUniqueSymbols([...portfolioSymbols, ...extraSymbols]),
    [extraSymbols, portfolioSymbols],
  );

  const bundles = useMemo(() => {
    const result: typeof stockDataBySymbol = {};
    for (const symbol of symbols) {
      const bundle = stockDataBySymbol[symbol];
      if (bundle) {
        result[symbol] = bundle;
      }
    }
    return result;
  }, [symbols, stockDataBySymbol]);

  const isPortfolioQuotesLoading = useMemo(
    () => portfolioSymbols.some((symbol) => stockDataLoadingBySymbol[symbol]),
    [portfolioSymbols, stockDataLoadingBySymbol],
  );

  const isAnySymbolLoading = useMemo(
    () => symbols.some((symbol) => stockDataLoadingBySymbol[symbol]),
    [symbols, stockDataLoadingBySymbol],
  );

  const freshnessStatus = useMemo(
    () => derivePageFreshnessStatus(bundles, portfolioSymbols.length > 0 && isPortfolioQuotesLoading),
    [bundles, isPortfolioQuotesLoading, portfolioSymbols.length],
  );

  return {
    userHoldings,
    cashBalance,
    bundles,
    freshnessStatus,
    isPortfolioQuotesLoading,
    isLoading: portfolioSymbols.length > 0 && isPortfolioQuotesLoading,
    isAnySymbolLoading: symbols.length > 0 && isAnySymbolLoading,
    enrichedHoldings: enrichedPortfolioHoldings,
    summary: portfolioSummary,
  };
};
