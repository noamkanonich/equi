import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";
import type { AlertStatus } from "@/data/alerts/alerts.types";
import type { SetAlertFormState } from "@/data/alerts/set-alert.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import type {
  PortfolioCashBalance,
  PortfolioHolding,
  PortfolioHoldingFormInput,
  PortfolioAccountType,
  PortfolioStrategyTag,
} from "@/data/portfolio/portfolio.types";
import { defaultGeneralSettings } from "@/data/settings/settings.mock";
import { normalizeAiPreferencesState } from "@/data/settings/mappers";
import type {
  AiPreferencesState,
  AlertSettingsState,
  AppearanceSettingsState,
  GeneralSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
} from "@/data/settings/settings.types";
import type { EquiUserSettings } from "@/data/supabase/supabase.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";
import type {
  WatchlistItemFormInput,
  WatchlistStatus,
  WatchlistStoredItem,
} from "@/data/watchlist/watchlist.types";
import type {
  SupabaseCashBalanceRow,
  SupabasePortfolioHoldingRow,
  SupabaseStockNoteRow,
  SupabaseUserAlertRow,
  SupabaseUserSettingsRow,
  SupabaseWatchlistItemRow,
} from "@/data/supabase/supabase.types";

const DEFAULT_WATCHLIST_METADATA = {
  qualityScore: 70,
  opportunityScore: 65,
  trigger: { summaryKey: "rows.default.trigger" },
  action: "reviewStock" as const,
  isFavorite: false,
  whyWatchingKey: "rows.default.whyWatching",
  monitorKeys: [] as string[],
  opportunityTrend: [] as { date: string; score: number }[],
};

const parseGeneralNotesJson = (value: string | null): StockGeneralNote[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as StockGeneralNote[];
  } catch {
    return [];
  }
};

const serializeGeneralNotesJson = (notes: StockGeneralNote[]): string | null => {
  if (notes.length === 0) {
    return null;
  }
  return JSON.stringify(notes);
};

const parseTargetValue = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatTargetValue = (value: number | null): string => {
  if (value === null) {
    return "";
  }
  return String(value);
};

export const mapPortfolioHoldingToSupabaseRow = (
  userId: string,
  holding: PortfolioHolding,
): Omit<SupabasePortfolioHoldingRow, "created_at" | "updated_at"> => ({
  id: holding.id,
  user_id: userId,
  symbol: holding.symbol,
  shares: holding.shares,
  average_cost: holding.averageCost,
  purchase_currency: holding.purchaseCurrency,
  purchase_date: holding.purchaseDate ?? null,
  account_name: holding.accountName ?? null,
  account_type: holding.accountType ?? null,
  target_allocation_percent: holding.targetAllocationPercent ?? null,
  strategy_tag: holding.strategyTag ?? null,
  notes: holding.notes ?? null,
});

export const mapSupabaseRowToPortfolioHolding = (
  row: SupabasePortfolioHoldingRow,
): PortfolioHolding => ({
  id: row.id,
  symbol: row.symbol,
  assetId: `US:${row.symbol}`,
  market: "US",
  provider: "fmp",
  providerSymbol: row.symbol,
  shares: Number(row.shares),
  averageCost: Number(row.average_cost),
  purchaseCurrency: row.purchase_currency as CurrencyCode,
  purchaseDate: row.purchase_date ?? undefined,
  accountName: row.account_name ?? undefined,
  accountType: (row.account_type as PortfolioAccountType | null) ?? undefined,
  targetAllocationPercent:
    row.target_allocation_percent !== null
      ? Number(row.target_allocation_percent)
      : undefined,
  strategyTag: (row.strategy_tag as PortfolioStrategyTag | null) ?? undefined,
  notes: row.notes ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapPortfolioHoldingFormToSupabaseInsert = (
  userId: string,
  holdingId: string,
  input: PortfolioHoldingFormInput,
): Omit<SupabasePortfolioHoldingRow, "created_at" | "updated_at"> => {
  const now = new Date().toISOString();
  const holding: PortfolioHolding = {
    id: holdingId,
    symbol: input.symbol.trim().toUpperCase(),
    shares: input.shares,
    averageCost: input.averageCost,
    purchaseCurrency: input.purchaseCurrency,
    purchaseDate: input.purchaseDate,
    accountName: input.accountName,
    accountType: input.accountType,
    targetAllocationPercent: input.targetAllocationPercent,
    strategyTag: input.strategyTag,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  return mapPortfolioHoldingToSupabaseRow(userId, holding);
};

export const mapCashBalanceToSupabaseRow = (
  userId: string,
  cashBalance: PortfolioCashBalance,
  rowId?: string,
): Omit<SupabaseCashBalanceRow, "created_at" | "updated_at"> => ({
  id: rowId ?? crypto.randomUUID(),
  user_id: userId,
  amount: cashBalance.amount,
  currency: cashBalance.currency,
});

export const mapSupabaseRowToCashBalance = (
  row: SupabaseCashBalanceRow,
): PortfolioCashBalance => ({
  amount: Number(row.amount),
  currency: row.currency as CurrencyCode,
});

export const mapWatchlistItemToSupabaseRow = (
  userId: string,
  item: WatchlistStoredItem,
): Omit<SupabaseWatchlistItemRow, "created_at" | "updated_at"> => ({
  id: item.id,
  user_id: userId,
  symbol: item.symbol,
  buy_zone_min: item.buyZone.low,
  buy_zone_max: item.buyZone.high,
  target_price: item.targetPrice ?? null,
  priority: null,
  status: item.status ?? null,
  notes: item.notes ?? null,
});

export const mapSupabaseRowToWatchlistItem = (
  row: SupabaseWatchlistItemRow,
): WatchlistStoredItem => {
  const currency = "USD" as CurrencyCode;
  return {
    id: row.id,
    symbol: row.symbol,
    assetId: `US:${row.symbol}`,
    market: "US",
    provider: "fmp",
    providerSymbol: row.symbol,
    currency,
    buyZone: {
      low: row.buy_zone_min !== null ? Number(row.buy_zone_min) : 0,
      high: row.buy_zone_max !== null ? Number(row.buy_zone_max) : 0,
      currency,
    },
    targetPrice: row.target_price !== null ? Number(row.target_price) : undefined,
    notes: row.notes ?? undefined,
    status: (row.status as WatchlistStatus | null) ?? "watchClosely",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...DEFAULT_WATCHLIST_METADATA,
  };
};

export const mapWatchlistFormToSupabaseInsert = (
  userId: string,
  itemId: string,
  input: WatchlistItemFormInput,
): Omit<SupabaseWatchlistItemRow, "created_at" | "updated_at"> => {
  const item = mapSupabaseRowToWatchlistItem({
    id: itemId,
    user_id: userId,
    symbol: input.symbol.trim().toUpperCase(),
    buy_zone_min: input.buyZone.low,
    buy_zone_max: input.buyZone.high,
    target_price: input.targetPrice ?? null,
    priority: null,
    status: input.status ?? "watchClosely",
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return mapWatchlistItemToSupabaseRow(userId, item);
};

export type StockNotesBundle = {
  thesisBySymbol: Record<string, StockThesisContent>;
  generalNotesBySymbol: Record<string, StockGeneralNote[]>;
};

export const mapStockNotesRowsToBundle = (
  rows: SupabaseStockNoteRow[],
): StockNotesBundle => {
  const thesisBySymbol: Record<string, StockThesisContent> = {};
  const generalNotesBySymbol: Record<string, StockGeneralNote[]> = {};

  for (const row of rows) {
    const symbol = row.symbol.trim().toUpperCase();
    thesisBySymbol[symbol] = {
      whyIOwnIt: row.thesis ?? "",
      whatToWatch: row.what_to_watch ?? "",
      sellIf: row.sell_if ?? "",
    };
    generalNotesBySymbol[symbol] = parseGeneralNotesJson(row.general_note);
  }

  return { thesisBySymbol, generalNotesBySymbol };
};

export const mapStockNoteToSupabaseRow = (
  userId: string,
  symbol: string,
  thesis: StockThesisContent,
  generalNotes: StockGeneralNote[],
  rowId?: string,
): Omit<SupabaseStockNoteRow, "created_at" | "updated_at"> => ({
  id: rowId ?? crypto.randomUUID(),
  user_id: userId,
  symbol: symbol.trim().toUpperCase(),
  thesis: thesis.whyIOwnIt || null,
  what_to_watch: thesis.whatToWatch || null,
  sell_if: thesis.sellIf || null,
  general_note: serializeGeneralNotesJson(generalNotes),
});

export const mapSupabaseRowToStockNote = (
  row: SupabaseStockNoteRow,
): { symbol: string; thesis: StockThesisContent; generalNotes: StockGeneralNote[] } => ({
  symbol: row.symbol.trim().toUpperCase(),
  thesis: {
    whyIOwnIt: row.thesis ?? "",
    whatToWatch: row.what_to_watch ?? "",
    sellIf: row.sell_if ?? "",
  },
  generalNotes: parseGeneralNotesJson(row.general_note),
});

export const mapUserAlertToSupabaseRow = (
  userId: string,
  alert: UserCreatedAlert,
): Omit<SupabaseUserAlertRow, "created_at" | "updated_at"> => ({
  id: alert.id,
  user_id: userId,
  symbol: alert.symbol,
  alert_type: alert.form.alertType,
  target_value: parseTargetValue(alert.form.targetValue),
  priority: alert.form.priority,
  status: alert.status,
  note: alert.form.note || null,
  snoozed_until: null,
  triggered_at: alert.status === "triggered" ? new Date().toISOString() : null,
});

export const mapSupabaseRowToUserAlert = (
  row: SupabaseUserAlertRow,
): UserCreatedAlert => {
  const form: SetAlertFormState & { note?: string } = {
    alertType: row.alert_type as SetAlertFormState["alertType"],
    targetValue: formatTargetValue(
      row.target_value !== null ? Number(row.target_value) : null,
    ),
    priority: (row.priority as SetAlertFormState["priority"]) ?? "medium",
    note: row.note ?? "",
  };

  return {
    id: row.id,
    symbol: row.symbol ?? "",
    form,
    status: row.status as AlertStatus,
    createdAt: row.created_at,
  };
};

export const mapSettingsToSupabaseRow = (
  userId: string,
  settings: EquiUserSettings,
  rowId?: string,
): Omit<SupabaseUserSettingsRow, "created_at" | "updated_at"> => ({
  id: rowId ?? crypto.randomUUID(),
  user_id: userId,
  display_currency: settings.displayCurrency,
  language: settings.language,
  general_settings: settings.general as unknown as SupabaseUserSettingsRow["general_settings"],
  appearance_settings: settings.appearance,
  portfolio_settings: settings.portfolio,
  scoring_settings: settings.scoringModel,
  alerts_settings: settings.alerts,
  ai_preferences: settings.aiPreferences,
});

export const mapSupabaseRowToSettings = (
  row: SupabaseUserSettingsRow,
): EquiUserSettings => {
  const generalPartial = (row.general_settings ?? {}) as Partial<
    Omit<GeneralSettingsState, "language" | "displayCurrency">
  >;
  const appearance = (row.appearance_settings ?? {}) as AppearanceSettingsState;
  const portfolio = (row.portfolio_settings ?? {}) as PortfolioSettingsState;
  const scoringModel = (row.scoring_settings ?? {}) as ScoringModelSettingsState;
  const alerts = (row.alerts_settings ?? {}) as AlertSettingsState;
  const aiPreferences = normalizeAiPreferencesState(
    (row.ai_preferences ?? {}) as AiPreferencesState & Record<string, unknown>,
  );

  return {
    language: (row.language as SupportedLocale | null) ?? defaultGeneralSettings.language,
    displayCurrency:
      (row.display_currency as CurrencyCode | null) ?? defaultGeneralSettings.displayCurrency,
    general: {
      ...defaultGeneralSettings,
      ...generalPartial,
    },
    appearance,
    portfolio,
    scoringModel,
    alerts,
    aiPreferences,
  };
};
