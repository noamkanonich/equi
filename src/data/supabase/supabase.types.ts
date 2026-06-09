import type { Json } from "@/data/supabase/json.types";
import type {
  AiPreferencesState,
  AlertSettingsState,
  AppearanceSettingsState,
  GeneralSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
} from "@/data/settings/settings.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";

export type SupabaseProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabasePortfolioHoldingRow = {
  id: string;
  user_id: string;
  symbol: string;
  shares: number;
  average_cost: number;
  purchase_currency: string;
  purchase_date: string | null;
  account_name: string | null;
  account_type: string | null;
  target_allocation_percent: number | null;
  strategy_tag: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseCashBalanceRow = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type SupabaseWatchlistItemRow = {
  id: string;
  user_id: string;
  symbol: string;
  buy_zone_min: number | null;
  buy_zone_max: number | null;
  target_price: number | null;
  priority: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseStockNoteRow = {
  id: string;
  user_id: string;
  symbol: string;
  thesis: string | null;
  what_to_watch: string | null;
  sell_if: string | null;
  general_note: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseUserAlertRow = {
  id: string;
  user_id: string;
  symbol: string | null;
  alert_type: string;
  target_value: number | null;
  priority: string | null;
  status: string;
  note: string | null;
  snoozed_until: string | null;
  triggered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SupabaseUserSettingsRow = {
  id: string;
  user_id: string;
  display_currency: string | null;
  language: string | null;
  general_settings: Json;
  appearance_settings: Json;
  portfolio_settings: Json;
  scoring_settings: Json;
  alerts_settings: Json;
  ai_preferences: Json;
  created_at: string;
  updated_at: string;
};

/** Aggregated app settings persisted in user_settings. */
export type EquiUserSettings = {
  language: SupportedLocale;
  displayCurrency: CurrencyCode;
  general: Omit<GeneralSettingsState, "language" | "displayCurrency">;
  appearance: AppearanceSettingsState;
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
};

export type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};
