import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import {
  initialPortfolioCashBalance,
  initialPortfolioHoldings,
} from "@/data/portfolio/portfolio.mock";
import { initialWatchlistItems } from "@/data/watchlist/watchlist.mock";
import type { EnsureStockDataOptions } from "@/data/app-data/app-data.types";
import {
  emptyCashBalance,
  emptyPortfolioHoldings,
  emptyStockGeneralNotesBySymbol,
  emptyStockThesisBySymbol,
  emptyUserAlerts,
  emptyWatchlistItems,
} from "@/data/app-data/empty-user-data";
import { resolveClientRequestedSections } from "@/utils/app-data/clientSectionTtl";
import {
  logAppDataInflightSkipped,
  logEnsureStockDataSummary,
} from "@/utils/app-data/devAppDataLog";
import { fetchStockDataForSymbols } from "@/utils/app-data/fetchStockDataForSymbols";
import { isStockDataFresh } from "@/utils/app-data/isStockDataFresh";
import {
  buildSectionFetchTimestamps,
  mergeStockDataBundles,
} from "@/utils/financial-data/mergeStockDataBundles";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import { addPortfolioHolding } from "@/utils/portfolio/addPortfolioHolding";
import { removePortfolioHolding } from "@/utils/portfolio/removePortfolioHolding";
import {
  updatePortfolioHolding,
  updatePortfolioHoldingNotes,
} from "@/utils/portfolio/updatePortfolioHolding";
import {
  addWatchlistItem,
  removeWatchlistItem,
  updateWatchlistItem,
} from "@/utils/watchlist/watchlistItemCrud";
import type { AppDataStore } from "@/data/app-data/app-data.types";
import type { UserCreatedAlertInput } from "@/data/app-data/user-alert.types";
import {
  isSymbolInPortfolio,
  isSymbolInWatchlist,
} from "@/utils/app-data/isSymbolInWatchlist";
import {
  APP_DATA_STORAGE_KEY,
  mergePersistedAppData,
  partializeAppDataState,
} from "@/utils/app-data/appDataPersistence";
import {
  persistCashBalance,
  persistPortfolioHoldingCreate,
  persistPortfolioHoldingDelete,
  persistPortfolioHoldingUpdate,
  persistStockGeneralNote,
  persistStockThesis,
  persistUserAlertCreate,
  persistUserAlertDelete,
  persistUserAlertUpdate,
  persistWatchlistItemCreate,
  persistWatchlistItemDelete,
  persistWatchlistItemUpdate,
} from "@/utils/user-data/userDataSync";

const inflightEnsureRequests = new Map<string, Promise<void>>();

const buildInflightKey = (
  symbols: string[],
  force: boolean,
  sectionsKey: string,
): string =>
  `${force ? "force" : "ensure"}:${sectionsKey}:${[...symbols].sort().join(",")}`;

const buildNormalizedSectionsKey = (
  sections: ReturnType<typeof resolveClientRequestedSections>,
): string => [...sections].sort().join(",");

const resolveSymbolsToFetch = (
  symbols: string[],
  state: AppDataStore,
  force: boolean,
  options?: EnsureStockDataOptions,
): string[] => {
  const uniqueSymbols = collectUniqueSymbols(symbols);

  return uniqueSymbols.filter((symbol) => {
    if (force) {
      return true;
    }

    const bundle = state.stockDataBySymbol[symbol];
    const lastFetchedAt = state.lastFetchedAtBySymbol[symbol];
    const lastFetchedSections = state.lastFetchedSectionsBySymbol[symbol];

    return !isStockDataFresh(lastFetchedAt, bundle, lastFetchedSections, options);
  });
};

const applyFetchedBundles = (
  bundles: Record<string, StockProviderDataBundle>,
  symbols: string[],
  requestedSections: ReturnType<typeof resolveClientRequestedSections>,
  set: (partial: Partial<AppDataStore> | ((state: AppDataStore) => Partial<AppDataStore>)) => void,
): void => {
  const now = new Date().toISOString();
  const sectionTimestamps = buildSectionFetchTimestamps(requestedSections, now);

  set((state) => {
    const nextStockData = { ...state.stockDataBySymbol };
    const nextLastFetched = { ...state.lastFetchedAtBySymbol };
    const nextLastFetchedSections = { ...state.lastFetchedSectionsBySymbol };
    const nextLoading = { ...state.stockDataLoadingBySymbol };
    const nextErrors = { ...state.stockDataErrorBySymbol };

    for (const symbol of symbols) {
      if (bundles[symbol]) {
        nextStockData[symbol] = mergeStockDataBundles(
          state.stockDataBySymbol[symbol],
          bundles[symbol],
          requestedSections,
        );
        nextLastFetched[symbol] = now;
        nextLastFetchedSections[symbol] = {
          ...state.lastFetchedSectionsBySymbol[symbol],
          ...sectionTimestamps,
        };
      }
      nextLoading[symbol] = false;
      delete nextErrors[symbol];
    }

    return {
      stockDataBySymbol: nextStockData,
      lastFetchedAtBySymbol: nextLastFetched,
      lastFetchedSectionsBySymbol: nextLastFetchedSections,
      stockDataLoadingBySymbol: nextLoading,
      stockDataErrorBySymbol: nextErrors,
    };
  });
};

const markSymbolsLoading = (
  symbols: string[],
  set: (partial: Partial<AppDataStore> | ((state: AppDataStore) => Partial<AppDataStore>)) => void,
): void => {
  set((state) => {
    const nextLoading = { ...state.stockDataLoadingBySymbol };
    for (const symbol of symbols) {
      nextLoading[symbol] = true;
    }
    return { stockDataLoadingBySymbol: nextLoading };
  });
};

const markSymbolsError = (
  symbols: string[],
  message: string,
  set: (partial: Partial<AppDataStore> | ((state: AppDataStore) => Partial<AppDataStore>)) => void,
): void => {
  set((state) => {
    const nextLoading = { ...state.stockDataLoadingBySymbol };
    const nextErrors = { ...state.stockDataErrorBySymbol };

    for (const symbol of symbols) {
      nextLoading[symbol] = false;
      nextErrors[symbol] = message;
    }

    return {
      stockDataLoadingBySymbol: nextLoading,
      stockDataErrorBySymbol: nextErrors,
    };
  });
};

export const useAppDataStore = create<AppDataStore>()(
  persist(
    (set, get) => ({
  portfolioHoldings: initialPortfolioHoldings,
  cashBalance: initialPortfolioCashBalance,
  watchlistItems: initialWatchlistItems,
  stockDataBySymbol: {},
  stockDataLoadingBySymbol: {},
  stockDataErrorBySymbol: {},
  lastFetchedAtBySymbol: {},
  lastFetchedSectionsBySymbol: {},
  stockThesisBySymbol: {},
  stockGeneralNotesBySymbol: {},
  userCreatedAlerts: [],
  alertStatusOverrides: {},
  userDataSyncError: null,
  authMode: "local",
  portfolioDataSource: "localMock",
  isUserDataLoaded: true,
  isUsingDemoPortfolio: true,

  setAppDataMode: (mode) => {
    set(mode);
  },

  resetToEmptyUserData: () => {
    set({
      portfolioHoldings: emptyPortfolioHoldings,
      cashBalance: emptyCashBalance,
      watchlistItems: emptyWatchlistItems,
      stockDataBySymbol: {},
      stockDataLoadingBySymbol: {},
      stockDataErrorBySymbol: {},
      lastFetchedAtBySymbol: {},
      lastFetchedSectionsBySymbol: {},
      stockThesisBySymbol: emptyStockThesisBySymbol,
      stockGeneralNotesBySymbol: emptyStockGeneralNotesBySymbol,
      userCreatedAlerts: emptyUserAlerts,
      alertStatusOverrides: {},
      userDataSyncError: null,
      portfolioDataSource: "supabase",
      isUsingDemoPortfolio: false,
    });
  },

  addPortfolioHolding: (input) => {
    const symbol = input.symbol.trim().toUpperCase();
    const previousIds = new Set(get().portfolioHoldings.map((holding) => holding.id));
    set((state) => ({
      portfolioHoldings: addPortfolioHolding(state.portfolioHoldings, input),
    }));
    const created = get().portfolioHoldings.find((holding) => !previousIds.has(holding.id));
    if (created) {
      void persistPortfolioHoldingCreate(created.id);
    }
    void get().ensureStockDataForSymbols([symbol], {
      sections: ["quote", "profile"],
    });
  },

  updatePortfolioHolding: (id, input) => {
    set((state) => ({
      portfolioHoldings: updatePortfolioHolding(state.portfolioHoldings, id, input),
    }));
    void persistPortfolioHoldingUpdate(id);
  },

  updatePortfolioHoldingNotes: (id, notes) => {
    set((state) => ({
      portfolioHoldings: updatePortfolioHoldingNotes(state.portfolioHoldings, id, notes),
    }));
    void persistPortfolioHoldingUpdate(id);
  },

  removePortfolioHolding: (id) => {
    set((state) => ({
      portfolioHoldings: removePortfolioHolding(state.portfolioHoldings, id),
    }));
    void persistPortfolioHoldingDelete(id);
  },

  setCashBalance: (cashBalance) => {
    set({ cashBalance });
    void persistCashBalance(cashBalance);
  },

  addWatchlistItem: (input) => {
    const symbol = input.symbol.trim().toUpperCase();
    if (isSymbolInWatchlist(get().watchlistItems, symbol)) {
      return;
    }
    const previousIds = new Set(get().watchlistItems.map((item) => item.id));
    set((state) => ({
      watchlistItems: addWatchlistItem(state.watchlistItems, input),
    }));
    const created = get().watchlistItems.find((item) => !previousIds.has(item.id));
    if (created) {
      void persistWatchlistItemCreate(created.id);
    }
    if ((input.market ?? "US") === "US") {
      void get().ensureStockDataForSymbols([symbol]);
    }
  },

  updateWatchlistItem: (id, input) => {
    set((state) => ({
      watchlistItems: updateWatchlistItem(state.watchlistItems, id, input),
    }));
    void persistWatchlistItemUpdate(id);
  },

  removeWatchlistItem: (id) => {
    set((state) => ({
      watchlistItems: removeWatchlistItem(state.watchlistItems, id),
    }));
    void persistWatchlistItemDelete(id);
  },

  setStockThesis: (symbol, content) => {
    const normalized = symbol.trim().toUpperCase();
    set((state) => ({
      stockThesisBySymbol: {
        ...state.stockThesisBySymbol,
        [normalized]: content,
      },
    }));
    void persistStockThesis(normalized, content);
  },

  getStockThesis: (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    return get().stockThesisBySymbol[normalized];
  },

  addUserAlert: (input: UserCreatedAlertInput) => {
    const symbol = input.symbol.trim().toUpperCase();
    const alert = {
      id: crypto.randomUUID(),
      symbol,
      form: input.form,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      userCreatedAlerts: [alert, ...state.userCreatedAlerts],
    }));
    void persistUserAlertCreate(alert.id);
  },

  updateAlert: (id, changes) => {
    set((state) => ({
      userCreatedAlerts: state.userCreatedAlerts.map((alert) =>
        alert.id === id ? { ...alert, ...changes } : alert,
      ),
    }));
    void persistUserAlertUpdate(id);
  },

  removeAlert: (id) => {
    set((state) => ({
      userCreatedAlerts: state.userCreatedAlerts.filter((alert) => alert.id !== id),
    }));
    void persistUserAlertDelete(id);
  },

  setAlertStatus: (id, status) => {
    const isUserAlert = get().userCreatedAlerts.some((alert) => alert.id === id);
    if (isUserAlert) {
      get().updateAlert(id, { status });
      return;
    }
    set((state) => ({
      alertStatusOverrides: {
        ...state.alertStatusOverrides,
        [id]: status,
      },
    }));
  },

  getAlertStatus: (id, fallbackStatus) => {
    const userAlert = get().userCreatedAlerts.find((alert) => alert.id === id);
    if (userAlert) {
      return userAlert.status;
    }
    return get().alertStatusOverrides[id] ?? fallbackStatus;
  },

  addStockGeneralNote: (symbol, note) => {
    const normalized = symbol.trim().toUpperCase();
    const entry = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      stockGeneralNotesBySymbol: {
        ...state.stockGeneralNotesBySymbol,
        [normalized]: [entry, ...(state.stockGeneralNotesBySymbol[normalized] ?? [])],
      },
    }));
    void persistStockGeneralNote(normalized);
  },

  getStockGeneralNotes: (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    return get().stockGeneralNotesBySymbol[normalized] ?? [];
  },

  isInWatchlist: (symbol) => isSymbolInWatchlist(get().watchlistItems, symbol),

  isInPortfolio: (symbol) => isSymbolInPortfolio(get().portfolioHoldings, symbol),

  hydrateStockData: (symbol, bundle) => {
    const normalized = symbol.trim().toUpperCase();
    const now = new Date().toISOString();
    const sectionsToStamp =
      bundle.meta.availableDataSections &&
      bundle.meta.availableDataSections.length > 0
        ? bundle.meta.availableDataSections
        : resolveClientRequestedSections({ scope: "full" });
    set((state) => ({
      stockDataBySymbol: {
        ...state.stockDataBySymbol,
        [normalized]: bundle,
      },
      lastFetchedAtBySymbol: {
        ...state.lastFetchedAtBySymbol,
        [normalized]: now,
      },
      lastFetchedSectionsBySymbol: {
        ...state.lastFetchedSectionsBySymbol,
        [normalized]: buildSectionFetchTimestamps(sectionsToStamp, now),
      },
    }));
  },

  getStockData: (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    return get().stockDataBySymbol[normalized];
  },

  isStockDataLoading: (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    return Boolean(get().stockDataLoadingBySymbol[normalized]);
  },

  getStockDataMeta: (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    return get().stockDataBySymbol[normalized]?.meta;
  },

  ensureStockDataForSymbols: async (symbols, options) => {
    const force = options?.force ?? false;
    const uniqueSymbols = collectUniqueSymbols(symbols);
    const requestedSections = resolveClientRequestedSections({
      scope: options?.scope,
      sections: options?.sections,
    });
    const sectionsKey = buildNormalizedSectionsKey(requestedSections);
    const state = get();
    const symbolsToFetch = resolveSymbolsToFetch(uniqueSymbols, state, force, options);
    const freshSkippedSymbols = uniqueSymbols.filter(
      (symbol) => !symbolsToFetch.includes(symbol),
    );

    logEnsureStockDataSummary({
      requestedCount: symbols.length,
      uniqueCount: uniqueSymbols.length,
      freshSkippedSymbols,
      fetchingSymbols: symbolsToFetch,
      sections: requestedSections,
    });

    if (symbolsToFetch.length === 0) {
      return;
    }

    const inflightKey = buildInflightKey(symbolsToFetch, force, sectionsKey);
    const existingInflight = inflightEnsureRequests.get(inflightKey);
    if (existingInflight) {
      logAppDataInflightSkipped(symbolsToFetch);
      await existingInflight;
      return;
    }

    markSymbolsLoading(symbolsToFetch, set);

    const request = (async () => {
      try {
        const bundles = await fetchStockDataForSymbols(symbolsToFetch, {
          scope: options?.scope ?? "display",
          sections: options?.sections,
        });
        applyFetchedBundles(bundles, symbolsToFetch, requestedSections, set);
      } catch {
        markSymbolsError(symbolsToFetch, "fetch_failed", set);
      } finally {
        inflightEnsureRequests.delete(inflightKey);
      }
    })();

    inflightEnsureRequests.set(inflightKey, request);
    await request;
  },

  refreshStockDataForSymbols: async (symbols, options) => {
    await get().ensureStockDataForSymbols(symbols, {
      ...options,
      force: true,
    });
  },

  resetToMock: () => {
    set({
      portfolioHoldings: initialPortfolioHoldings,
      cashBalance: initialPortfolioCashBalance,
      watchlistItems: initialWatchlistItems,
      stockDataBySymbol: {},
      stockDataLoadingBySymbol: {},
      stockDataErrorBySymbol: {},
      lastFetchedAtBySymbol: {},
      lastFetchedSectionsBySymbol: {},
      stockThesisBySymbol: {},
      stockGeneralNotesBySymbol: {},
      userCreatedAlerts: [],
      alertStatusOverrides: {},
      userDataSyncError: null,
      authMode: "local",
      portfolioDataSource: "localMock",
      isUserDataLoaded: true,
      isUsingDemoPortfolio: true,
    });
    void useAppDataStore.persist.clearStorage();
  },
    }),
    {
      name: APP_DATA_STORAGE_KEY,
      partialize: (state) => partializeAppDataState(state),
      merge: (persisted, current) => mergePersistedAppData(persisted, current),
    },
  ),
);
