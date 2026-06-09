import type { EquiUserSettings, ServiceResult } from "@/data/supabase/supabase.types";
import {
  mapSettingsToSupabaseRow,
  mapSupabaseRowToSettings,
} from "@/services/user-data/mappers";
import {
  errorResult,
  getUserDataClient,
  noOpResult,
  resolveSupabaseError,
  successResult,
} from "@/services/user-data/serviceUtils";

export type LoadedUserSettings = {
  settings: EquiUserSettings;
  rowId: string;
};

export const loadUserSettings = async (
  userId: string,
): Promise<ServiceResult<LoadedUserSettings | null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "load_user_settings_failed");
  }

  if (!data) {
    return successResult(null);
  }

  return successResult({
    settings: mapSupabaseRowToSettings(data),
    rowId: data.id,
  });
};

export const upsertUserSettings = async (
  userId: string,
  settings: EquiUserSettings,
  rowId?: string,
): Promise<ServiceResult<EquiUserSettings>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapSettingsToSupabaseRow(userId, settings, rowId);
  const { data, error } = await client
    .from("user_settings")
    .upsert(
      {
        user_id: userId,
        display_currency: row.display_currency,
        language: row.language,
        general_settings: row.general_settings,
        appearance_settings: row.appearance_settings,
        portfolio_settings: row.portfolio_settings,
        scoring_settings: row.scoring_settings,
        alerts_settings: row.alerts_settings,
        ai_preferences: row.ai_preferences,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "upsert_user_settings_failed");
  }

  const mapped = mapSupabaseRowToSettings(data);
  return successResult(mapped);
};
