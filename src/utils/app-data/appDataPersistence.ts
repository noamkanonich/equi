import type { AppDataStore } from "@/data/app-data/app-data.types";
import type {
  PersistedAppDataV1,
  PersistedAppDataVersion,
} from "@/data/app-data/persisted-app-data.types";
import {
  initialPortfolioCashBalance,
  initialPortfolioHoldings,
} from "@/data/portfolio/portfolio.mock";
import { initialWatchlistItems } from "@/data/watchlist/watchlist.mock";

export const APP_DATA_STORAGE_KEY = "equi-app-user-data";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

const normalizeStringRecord = <T>(
  value: unknown,
  fallback: Record<string, T>,
): Record<string, T> => {
  if (!isRecord(value)) {
    return fallback;
  }
  return value as Record<string, T>;
};

const normalizePersistedPayload = (
  persisted: unknown,
): PersistedAppDataV1 | null => {
  if (!isRecord(persisted)) {
    return null;
  }

  const version = persisted.version as PersistedAppDataVersion | undefined;
  if (version !== "1") {
    return null;
  }

  if (
    !isArray(persisted.portfolioHoldings) ||
    !isRecord(persisted.cashBalance) ||
    !isArray(persisted.watchlistItems) ||
    !isRecord(persisted.stockThesisBySymbol) ||
    !isRecord(persisted.stockGeneralNotesBySymbol) ||
    !isArray(persisted.userCreatedAlerts)
  ) {
    return null;
  }

  const dismissedNextMoveIds = isArray(persisted.dismissedNextMoveIds)
    ? (persisted.dismissedNextMoveIds as string[])
    : [];

  return {
    version: "1",
    portfolioHoldings: persisted.portfolioHoldings as PersistedAppDataV1["portfolioHoldings"],
    cashBalance: persisted.cashBalance as PersistedAppDataV1["cashBalance"],
    watchlistItems: persisted.watchlistItems as PersistedAppDataV1["watchlistItems"],
    stockThesisBySymbol: normalizeStringRecord(
      persisted.stockThesisBySymbol,
      {},
    ),
    stockGeneralNotesBySymbol: normalizeStringRecord(
      persisted.stockGeneralNotesBySymbol,
      {},
    ),
    userCreatedAlerts: persisted.userCreatedAlerts as PersistedAppDataV1["userCreatedAlerts"],
    dismissedNextMoveIds,
  };
};

export const partializeAppDataState = (
  state: AppDataStore,
): PersistedAppDataV1 => ({
  version: "1",
  portfolioHoldings: state.portfolioHoldings,
  cashBalance: state.cashBalance,
  watchlistItems: state.watchlistItems,
  stockThesisBySymbol: state.stockThesisBySymbol,
  stockGeneralNotesBySymbol: state.stockGeneralNotesBySymbol,
  userCreatedAlerts: state.userCreatedAlerts,
  dismissedNextMoveIds: state.dismissedNextMoveIds,
});

export const mergePersistedAppData = (
  persisted: unknown,
  current: AppDataStore,
): AppDataStore => {
  const normalized = normalizePersistedPayload(persisted);

  if (!normalized) {
    return current;
  }

  return {
    ...current,
    portfolioHoldings: normalized.portfolioHoldings,
    cashBalance: normalized.cashBalance,
    watchlistItems: normalized.watchlistItems,
    stockThesisBySymbol: normalized.stockThesisBySymbol,
    stockGeneralNotesBySymbol: normalized.stockGeneralNotesBySymbol,
    userCreatedAlerts: normalized.userCreatedAlerts,
    dismissedNextMoveIds: normalized.dismissedNextMoveIds,
    stockDataBySymbol: {},
    stockDataLoadingBySymbol: {},
    stockDataErrorBySymbol: {},
    lastFetchedAtBySymbol: {},
    lastFetchedSectionsBySymbol: {},
    alertStatusOverrides: {},
    userDataSyncError: null,
  };
};

export const getDefaultPersistedAppData = (): PersistedAppDataV1 => ({
  version: "1",
  portfolioHoldings: initialPortfolioHoldings,
  cashBalance: initialPortfolioCashBalance,
  watchlistItems: initialWatchlistItems,
  stockThesisBySymbol: {},
  stockGeneralNotesBySymbol: {},
  userCreatedAlerts: [],
  dismissedNextMoveIds: [],
});

type PersistCapableStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (callback: () => void) => () => void;
  };
};

export const waitForAppDataRehydration = (
  store: PersistCapableStore,
): Promise<void> =>
  new Promise((resolve) => {
    if (store.persist.hasHydrated()) {
      resolve();
      return;
    }

    const unsubscribe = store.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
