import type { EquiUserSettings } from "@/data/supabase/supabase.types";
import type { PortfolioCashBalance } from "@/data/portfolio/portfolio.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";
import { getAuthenticatedUserId } from "@/lib/supabase/getAuthenticatedUserId";
import { isSupabaseConfigured } from "@/lib/supabase/supabase";
import {
  createPortfolioHolding,
  deletePortfolioHolding,
  updatePortfolioHolding,
} from "@/services/user-data/portfolio.service";
import { loadCashBalance, upsertCashBalance } from "@/services/user-data/cash.service";
import {
  createWatchlistItem,
  deleteWatchlistItem,
  loadWatchlistItems,
  updateWatchlistItem,
} from "@/services/user-data/watchlist.service";
import { loadStockNotes, upsertStockNote } from "@/services/user-data/notes.service";
import {
  createUserAlert,
  deleteUserAlert,
  loadUserAlerts,
  updateUserAlert,
} from "@/services/user-data/alerts.service";
import { loadUserSettings, upsertUserSettings } from "@/services/user-data/settings.service";
import { loadPortfolioHoldings } from "@/services/user-data/portfolio.service";
import { useAppDataStore } from "@/store/app-data.store";
import { emptyCashBalance } from "@/data/app-data/empty-user-data";
import { useAppStore } from "@/store/app.store";
import { useGeneralSettingsStore } from "@/store/general-settings.store";
import { useAppearanceStore } from "@/store/appearance.store";
import { usePortfolioSettingsStore } from "@/store/portfolio-settings.store";
import { useScoringSettingsStore } from "@/store/scoring-settings.store";
import { useAlertSettingsStore } from "@/store/alert-settings.store";
import { useAiPreferencesStore } from "@/store/ai-preferences.store";
import { applyAppearanceSettings } from "@/utils/settings/resetAppearanceSettings";
import { applyPortfolioSettings } from "@/utils/settings/applyPortfolioSettings";
import { applyScoringModelSettings } from "@/utils/settings/applyScoringModelSettings";
import { applyAlertSettings } from "@/utils/settings/applyAlertSettings";
import { applyAiPreferencesSettings } from "@/utils/settings/applyAiPreferencesSettings";

let cachedUserId: string | null = null;
let cachedSettingsRowId: string | undefined;

export const setCachedUserId = (userId: string | null) => {
  cachedUserId = userId;
  if (!userId) {
    cachedSettingsRowId = undefined;
  }
};

export const clearUserDataSyncContext = () => {
  cachedUserId = null;
  cachedSettingsRowId = undefined;
};

export const resetUserSettingsToDefaults = () => {
  useGeneralSettingsStore.getState().resetGeneralSettings();
  useAppearanceStore.getState().resetAppearanceSettings();
  usePortfolioSettingsStore.getState().resetPortfolioSettings();
  useScoringSettingsStore.getState().resetScoringModelSettings();
  useAlertSettingsStore.getState().resetAlertSettings();
  useAiPreferencesStore.getState().resetAiPreferences();
};

export const getUserDataSyncContext = async () => {
  const userId = await getAuthenticatedUserId();
  cachedUserId = userId;
  return {
    isConfigured: isSupabaseConfigured,
    userId,
  };
};

export const getCachedUserId = (): string | null => cachedUserId;

const handlePersistError = (context: string, error: string | null) => {
  if (!error) {
    return;
  }

  useAppDataStore.setState({ userDataSyncError: error });

  if (process.env.NODE_ENV === "development") {
    console.warn(`[user-data] ${context}:`, error);
  }
};

const clearPersistError = () => {
  useAppDataStore.setState({ userDataSyncError: null });
};

export const hydrateUserSettingsFromSupabase = (settings: EquiUserSettings) => {
  useAppStore.getState().setLocale(settings.language);
  useAppStore.getState().setDisplayCurrency(settings.displayCurrency);
  useGeneralSettingsStore.getState().setGeneralSettings(settings.general);
  applyAppearanceSettings(settings.appearance);
  applyPortfolioSettings(settings.portfolio);
  applyScoringModelSettings(settings.scoringModel);
  applyAlertSettings(settings.alerts);
  applyAiPreferencesSettings(settings.aiPreferences);
};

export const hydrateUserDataFromSupabase = async (userId: string): Promise<void> => {
  cachedUserId = userId;
  clearPersistError();

  const [
    holdingsResult,
    cashResult,
    watchlistResult,
    notesResult,
    alertsResult,
    settingsResult,
  ] = await Promise.all([
    loadPortfolioHoldings(userId),
    loadCashBalance(userId),
    loadWatchlistItems(userId),
    loadStockNotes(userId),
    loadUserAlerts(userId),
    loadUserSettings(userId),
  ]);

  if (holdingsResult.error) {
    handlePersistError("hydrate", holdingsResult.error);
    return;
  }

  const nonCriticalErrors = [
    cashResult.error,
    watchlistResult.error,
    notesResult.error,
    alertsResult.error,
    settingsResult.error,
  ].filter(Boolean);

  if (nonCriticalErrors.length > 0) {
    handlePersistError("hydrate", nonCriticalErrors[0] ?? "hydrate_partial_failed");
  }

  useAppDataStore.setState({
    portfolioHoldings: holdingsResult.data ?? [],
    cashBalance: cashResult.data ?? emptyCashBalance,
    watchlistItems: watchlistResult.data ?? [],
    stockThesisBySymbol: notesResult.data?.thesisBySymbol ?? {},
    stockGeneralNotesBySymbol: notesResult.data?.generalNotesBySymbol ?? {},
    userCreatedAlerts: alertsResult.data ?? [],
  });

  if (settingsResult.data) {
    cachedSettingsRowId = settingsResult.data.rowId;
    hydrateUserSettingsFromSupabase(settingsResult.data.settings);
  }
};

export const persistPortfolioHoldingCreate = async (holdingId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const holding = useAppDataStore
    .getState()
    .portfolioHoldings.find((item) => item.id === holdingId);

  if (!holding) {
    return;
  }

  const result = await createPortfolioHolding(userId, holding);
  handlePersistError("persistPortfolioHoldingCreate", result.error);
};

export const persistPortfolioHoldingUpdate = async (holdingId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const holding = useAppDataStore
    .getState()
    .portfolioHoldings.find((item) => item.id === holdingId);

  if (!holding) {
    return;
  }

  const result = await updatePortfolioHolding(userId, holdingId, holding);
  handlePersistError("persistPortfolioHoldingUpdate", result.error);
};

export const persistPortfolioHoldingDelete = async (holdingId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const result = await deletePortfolioHolding(userId, holdingId);
  handlePersistError("persistPortfolioHoldingDelete", result.error);
};

export const persistCashBalance = async (cashBalance: PortfolioCashBalance) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const result = await upsertCashBalance(userId, cashBalance);
  handlePersistError("persistCashBalance", result.error);
};

export const persistWatchlistItemCreate = async (itemId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const item = useAppDataStore
    .getState()
    .watchlistItems.find((entry) => entry.id === itemId);

  if (!item) {
    return;
  }

  const result = await createWatchlistItem(userId, item);
  handlePersistError("persistWatchlistItemCreate", result.error);
};

export const persistWatchlistItemUpdate = async (itemId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const item = useAppDataStore
    .getState()
    .watchlistItems.find((entry) => entry.id === itemId);

  if (!item) {
    return;
  }

  const result = await updateWatchlistItem(userId, itemId, item);
  handlePersistError("persistWatchlistItemUpdate", result.error);
};

export const persistWatchlistItemDelete = async (itemId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const result = await deleteWatchlistItem(userId, itemId);
  handlePersistError("persistWatchlistItemDelete", result.error);
};

export const persistStockThesis = async (symbol: string, thesis: StockThesisContent) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const normalized = symbol.trim().toUpperCase();
  const generalNotes =
    useAppDataStore.getState().stockGeneralNotesBySymbol[normalized] ?? [];

  const result = await upsertStockNote(userId, normalized, thesis, generalNotes);
  handlePersistError("persistStockThesis", result.error);
};

export const persistStockGeneralNote = async (symbol: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const normalized = symbol.trim().toUpperCase();
  const thesis =
    useAppDataStore.getState().stockThesisBySymbol[normalized] ?? {
      whyIOwnIt: "",
      whatToWatch: "",
      sellIf: "",
    };
  const generalNotes =
    useAppDataStore.getState().stockGeneralNotesBySymbol[normalized] ?? [];

  const result = await upsertStockNote(userId, normalized, thesis, generalNotes);
  handlePersistError("persistStockGeneralNote", result.error);
};

export const persistUserAlertCreate = async (alertId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const alert = useAppDataStore
    .getState()
    .userCreatedAlerts.find((entry) => entry.id === alertId);

  if (!alert) {
    return;
  }

  const result = await createUserAlert(userId, alert);
  handlePersistError("persistUserAlertCreate", result.error);
};

export const persistUserAlertUpdate = async (alertId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const alert = useAppDataStore
    .getState()
    .userCreatedAlerts.find((entry) => entry.id === alertId);

  if (!alert) {
    return;
  }

  const result = await updateUserAlert(userId, alertId, alert);
  handlePersistError("persistUserAlertUpdate", result.error);
};

export const persistUserAlertDelete = async (alertId: string) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const result = await deleteUserAlert(userId, alertId);
  handlePersistError("persistUserAlertDelete", result.error);
};

export const persistUserSettingsToSupabase = async (settings: EquiUserSettings) => {
  const userId = cachedUserId;
  if (!userId) {
    return;
  }

  const result = await upsertUserSettings(userId, settings, cachedSettingsRowId);
  if (result.data && !cachedSettingsRowId) {
    const reload = await loadUserSettings(userId);
    if (reload.data) {
      cachedSettingsRowId = reload.data.rowId;
    }
  }
  handlePersistError("persistUserSettings", result.error);
};

export const buildEquiUserSettingsSnapshot = (): EquiUserSettings => ({
  language: useAppStore.getState().locale,
  displayCurrency: useAppStore.getState().displayCurrency,
  general: useGeneralSettingsStore.getState().generalSettings,
  appearance: useAppearanceStore.getState().appearanceSettings,
  portfolio: usePortfolioSettingsStore.getState().portfolioSettings,
  scoringModel: useScoringSettingsStore.getState().scoringModelSettings,
  alerts: useAlertSettingsStore.getState().alertSettings,
  aiPreferences: useAiPreferencesStore.getState().aiPreferences,
});
