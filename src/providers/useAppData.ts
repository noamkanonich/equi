"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { UseAppDataReturn } from "@/data/app-data/app-data.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { initialWatchlistItems } from "@/data/watchlist/watchlist.mock";
import { portfolioMockData } from "@/data/portfolio/portfolio.mock";
import { useAuth } from "@/providers/useAuth";
import { useAlertSettingsStore } from "@/store/alert-settings.store";
import { useAppDataStore } from "@/store/app-data.store";
import { computeAlertCounts } from "@/utils/alerts/computeAlertCounts";
import { derivePageFreshnessStatus } from "@/utils/financial-data/derivePageFreshnessStatus";
import { enrichWatchlistItems } from "@/utils/financial-data/enrichWatchlistItems";
import { enrichPortfolioHoldings } from "@/utils/portfolio/enrichPortfolioHoldings";
import { calculatePortfolioSummary } from "@/utils/portfolio/calculatePortfolioSummary";

export const useAppData = (): UseAppDataReturn => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const alertSettings = useAlertSettingsStore((store) => store.alertSettings);
  const state = useAppDataStore(
    useShallow((store) => ({
      portfolioHoldings: store.portfolioHoldings,
      cashBalance: store.cashBalance,
      watchlistItems: store.watchlistItems,
      stockDataBySymbol: store.stockDataBySymbol,
      stockDataLoadingBySymbol: store.stockDataLoadingBySymbol,
      stockDataErrorBySymbol: store.stockDataErrorBySymbol,
      lastFetchedAtBySymbol: store.lastFetchedAtBySymbol,
      lastFetchedSectionsBySymbol: store.lastFetchedSectionsBySymbol,
      stockThesisBySymbol: store.stockThesisBySymbol,
      stockGeneralNotesBySymbol: store.stockGeneralNotesBySymbol,
      userCreatedAlerts: store.userCreatedAlerts,
      alertStatusOverrides: store.alertStatusOverrides,
      dismissedNextMoveIds: store.dismissedNextMoveIds,
      userDataSyncError: store.userDataSyncError,
      authMode: store.authMode,
      portfolioDataSource: store.portfolioDataSource,
      isUserDataLoaded: store.isUserDataLoaded,
      isUsingDemoPortfolio: store.isUsingDemoPortfolio,
      isAppDataInitialized: store.isAppDataInitialized,
      addPortfolioHolding: store.addPortfolioHolding,
      updatePortfolioHolding: store.updatePortfolioHolding,
      updatePortfolioHoldingNotes: store.updatePortfolioHoldingNotes,
      removePortfolioHolding: store.removePortfolioHolding,
      setCashBalance: store.setCashBalance,
      addWatchlistItem: store.addWatchlistItem,
      updateWatchlistItem: store.updateWatchlistItem,
      removeWatchlistItem: store.removeWatchlistItem,
      setStockThesis: store.setStockThesis,
      getStockThesis: store.getStockThesis,
      addUserAlert: store.addUserAlert,
      updateAlert: store.updateAlert,
      removeAlert: store.removeAlert,
      setAlertStatus: store.setAlertStatus,
      getAlertStatus: store.getAlertStatus,
      dismissNextMove: store.dismissNextMove,
      addStockGeneralNote: store.addStockGeneralNote,
      getStockGeneralNotes: store.getStockGeneralNotes,
      isInWatchlist: store.isInWatchlist,
      isInPortfolio: store.isInPortfolio,
      ensureStockDataForSymbols: store.ensureStockDataForSymbols,
      refreshStockDataForSymbols: store.refreshStockDataForSymbols,
      hydrateStockData: store.hydrateStockData,
      getStockData: store.getStockData,
      isStockDataLoading: store.isStockDataLoading,
      getStockDataMeta: store.getStockDataMeta,
      resetToMock: store.resetToMock,
      resetToEmptyUserData: store.resetToEmptyUserData,
      setAppDataMode: store.setAppDataMode,
    })),
  );

  const isAppDataReady = state.isAppDataInitialized && !isAuthLoading;
  const isAuthenticatedDataLoading =
    state.authMode === "authenticated" && !state.isUserDataLoaded;
  const isUserDataPending = !isAppDataReady || isAuthenticatedDataLoading;
  const isUsingDemoData = state.isUsingDemoPortfolio;
  const isUsingDemoWatchlist =
    state.isUsingDemoPortfolio &&
    state.watchlistItems.length === initialWatchlistItems.length &&
    state.watchlistItems.every(
      (item, index) => item.id === initialWatchlistItems[index]?.id,
    );

  const enrichedPortfolioHoldings = useMemo(
    () => enrichPortfolioHoldings(state.portfolioHoldings, state.stockDataBySymbol),
    [state.portfolioHoldings, state.stockDataBySymbol],
  );

  const portfolioSummary = useMemo(
    () =>
      calculatePortfolioSummary(enrichedPortfolioHoldings, {
        cashBalance: state.cashBalance,
        fallbackSummary: state.isUsingDemoPortfolio
          ? portfolioMockData.summary
          : undefined,
      }),
    [enrichedPortfolioHoldings, state.cashBalance, state.isUsingDemoPortfolio],
  );

  const enrichedWatchlistItems = useMemo(
    () => enrichWatchlistItems(state.watchlistItems, state.stockDataBySymbol),
    [state.watchlistItems, state.stockDataBySymbol],
  );

  const portfolioSymbols = useMemo(
    () => state.portfolioHoldings.map((holding) => holding.symbol),
    [state.portfolioHoldings],
  );

  const portfolioBundles = useMemo(() => {
    const bundles: Record<string, StockProviderDataBundle> = {};
    for (const symbol of portfolioSymbols) {
      const bundle = state.stockDataBySymbol[symbol];
      if (bundle) {
        bundles[symbol] = bundle;
      }
    }
    return bundles;
  }, [portfolioSymbols, state.stockDataBySymbol]);

  const isPortfolioStockDataLoading = useMemo(
    () => portfolioSymbols.some((symbol) => state.stockDataLoadingBySymbol[symbol]),
    [portfolioSymbols, state.stockDataLoadingBySymbol],
  );

  const portfolioFreshnessStatus = useMemo(
    () =>
      derivePageFreshnessStatus(
        portfolioBundles,
        portfolioSymbols.length > 0 && isPortfolioStockDataLoading,
      ),
    [
      portfolioBundles,
      isPortfolioStockDataLoading,
      portfolioSymbols.length,
    ],
  );

  const stockDataMetaBySymbol = useMemo(() => {
    const meta: UseAppDataReturn["stockDataMetaBySymbol"] = {};
    for (const [symbol, bundle] of Object.entries(state.stockDataBySymbol)) {
      meta[symbol] = bundle.meta;
    }
    return meta;
  }, [state.stockDataBySymbol]);

  const getWatchlistItemBase = (id: string) =>
    state.watchlistItems.find((item) => item.id === id);

  const { activeAlertsCount, snoozedAlertsCount } = useMemo(
    () =>
      computeAlertCounts(
        state.userCreatedAlerts,
        state.alertStatusOverrides,
        alertSettings,
        state.isUsingDemoPortfolio,
      ),
    [
      alertSettings,
      state.userCreatedAlerts,
      state.alertStatusOverrides,
      state.isUsingDemoPortfolio,
    ],
  );

  return {
    ...state,
    enrichedPortfolioHoldings,
    portfolioSummary,
    enrichedWatchlistItems,
    stockDataMetaBySymbol,
    portfolioFreshnessStatus,
    isPortfolioStockDataLoading,
    activeAlertsCount,
    snoozedAlertsCount,
    getWatchlistItemBase,
    isAuthenticated,
    isAppDataReady,
    isAuthenticatedDataLoading,
    isUserDataPending,
    isUsingDemoData,
    isUsingDemoWatchlist,
  };
};
