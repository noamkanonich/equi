/** App-wide user + provider state. Data ownership: `src/data/data-coverage.md`. */
import type { FinancialDataMeta, FinancialDataSection } from "@/data/financial-data/financial-data.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type {
  EnrichedPortfolioHolding,
  PortfolioCashBalance,
  PortfolioHolding,
  PortfolioHoldingFormInput,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";
import type {
  EnrichedWatchlistItem,
  WatchlistItemBase,
  WatchlistItemFormInput,
  WatchlistStoredItem,
} from "@/data/watchlist/watchlist.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";
import type { AlertStatus } from "@/data/alerts/alerts.types";
import type { UserCreatedAlert, UserCreatedAlertInput } from "@/data/app-data/user-alert.types";
import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";
import type { StockNoteFormState } from "@/data/stocks/stock-note.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";

export type AppAuthMode = "authenticated" | "local";

export type PortfolioDataSource = "supabase" | "localMock";

export type AppDataMode = {
  authMode: AppAuthMode;
  portfolioDataSource: PortfolioDataSource;
  isUserDataLoaded: boolean;
  isUsingDemoPortfolio: boolean;
  isAppDataInitialized: boolean;
};

export type StockDataScope = "display" | "full";

export type EnsureStockDataOptions = {
  sections?: FinancialDataSection[];
  scope?: StockDataScope;
  force?: boolean;
};

export type AppDataStockMeta = {
  lastFetchedAt: string;
  bundle: StockProviderDataBundle;
};

export type AppDataState = {
  portfolioHoldings: PortfolioHolding[];
  cashBalance: PortfolioCashBalance;
  watchlistItems: WatchlistStoredItem[];
  stockDataBySymbol: Record<string, StockProviderDataBundle>;
  stockDataLoadingBySymbol: Record<string, boolean>;
  stockDataErrorBySymbol: Record<string, string | undefined>;
  lastFetchedAtBySymbol: Record<string, string>;
  lastFetchedSectionsBySymbol: Record<
    string,
    Partial<Record<FinancialDataSection, string>>
  >;
  stockThesisBySymbol: Record<string, StockThesisContent>;
  stockGeneralNotesBySymbol: Record<string, StockGeneralNote[]>;
  userCreatedAlerts: UserCreatedAlert[];
  alertStatusOverrides: Record<string, AlertStatus>;
  dismissedNextMoveIds: string[];
  userDataSyncError: string | null;
} & AppDataMode;

export type AppDataActions = {
  addPortfolioHolding: (input: PortfolioHoldingFormInput) => void;
  updatePortfolioHolding: (
    id: string,
    input: Partial<PortfolioHoldingFormInput>,
  ) => void;
  updatePortfolioHoldingNotes: (id: string, notes: string) => void;
  removePortfolioHolding: (id: string) => void;
  setCashBalance: (cashBalance: PortfolioCashBalance) => void;
  addWatchlistItem: (input: WatchlistItemFormInput) => void;
  updateWatchlistItem: (
    id: string,
    input: Partial<WatchlistItemFormInput>,
  ) => void;
  removeWatchlistItem: (id: string) => void;
  setStockThesis: (symbol: string, content: StockThesisContent) => void;
  getStockThesis: (symbol: string) => StockThesisContent | undefined;
  addUserAlert: (input: UserCreatedAlertInput) => void;
  updateAlert: (id: string, changes: Partial<Omit<UserCreatedAlert, "id" | "createdAt">>) => void;
  removeAlert: (id: string) => void;
  setAlertStatus: (id: string, status: AlertStatus) => void;
  getAlertStatus: (id: string, fallbackStatus: AlertStatus) => AlertStatus;
  dismissNextMove: (moveId: string) => void;
  addStockGeneralNote: (symbol: string, note: StockNoteFormState) => void;
  getStockGeneralNotes: (symbol: string) => StockGeneralNote[];
  isInWatchlist: (symbol: string) => boolean;
  isInPortfolio: (symbol: string) => boolean;
  ensureStockDataForSymbols: (
    symbols: string[],
    options?: EnsureStockDataOptions,
  ) => Promise<void>;
  refreshStockDataForSymbols: (
    symbols: string[],
    options?: Omit<EnsureStockDataOptions, "force">,
  ) => Promise<void>;
  hydrateStockData: (symbol: string, bundle: StockProviderDataBundle) => void;
  getStockData: (symbol: string) => StockProviderDataBundle | undefined;
  isStockDataLoading: (symbol: string) => boolean;
  getStockDataMeta: (symbol: string) => FinancialDataMeta | undefined;
  resetToMock: () => void;
  resetToEmptyUserData: () => void;
  setAppDataMode: (mode: Partial<AppDataMode>) => void;
};

export type AppDataSelectors = {
  enrichedPortfolioHoldings: EnrichedPortfolioHolding[];
  portfolioSummary: PortfolioSummary;
  enrichedWatchlistItems: EnrichedWatchlistItem[];
  /** Derived from `stockDataBySymbol[symbol].meta` — not duplicated state. */
  stockDataMetaBySymbol: Record<string, FinancialDataMeta | undefined>;
  portfolioFreshnessStatus: DataFreshnessStatus;
  isPortfolioStockDataLoading: boolean;
  activeAlertsCount: number;
  snoozedAlertsCount: number;
};

export type AppDataStore = AppDataState & AppDataActions;

export type UseAppDataReturn = AppDataState &
  AppDataActions &
  AppDataSelectors & {
    getWatchlistItemBase: (id: string) => WatchlistItemBase | undefined;
    isAuthenticated: boolean;
    isAppDataReady: boolean;
    isAuthenticatedDataLoading: boolean;
    isUserDataPending: boolean;
    isUsingDemoData: boolean;
    isUsingDemoWatchlist: boolean;
  };
