import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import type { ServiceResult } from "@/data/supabase/supabase.types";
import {
  mapSupabaseRowToUserAlert,
  mapUserAlertToSupabaseRow,
} from "@/services/user-data/mappers";
import {
  errorResult,
  getUserDataClient,
  noOpResult,
  resolveSupabaseError,
  successResult,
} from "@/services/user-data/serviceUtils";

export const loadUserAlerts = async (
  userId: string,
): Promise<ServiceResult<UserCreatedAlert[]>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { data, error } = await client
    .from("user_alerts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "load_user_alerts_failed");
  }

  return successResult((data ?? []).map(mapSupabaseRowToUserAlert));
};

export const createUserAlert = async (
  userId: string,
  alert: UserCreatedAlert,
): Promise<ServiceResult<UserCreatedAlert>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapUserAlertToSupabaseRow(userId, alert);
  const { data, error } = await client
    .from("user_alerts")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "create_user_alert_failed");
  }

  return successResult(mapSupabaseRowToUserAlert(data));
};

export const updateUserAlert = async (
  userId: string,
  alertId: string,
  alert: UserCreatedAlert,
): Promise<ServiceResult<UserCreatedAlert>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapUserAlertToSupabaseRow(userId, alert);
  const { data, error } = await client
    .from("user_alerts")
    .update({
      symbol: row.symbol,
      alert_type: row.alert_type,
      target_value: row.target_value,
      priority: row.priority,
      status: row.status,
      note: row.note,
      snoozed_until: row.snoozed_until,
      triggered_at: row.triggered_at,
    })
    .eq("user_id", userId)
    .eq("id", alertId)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "update_user_alert_failed");
  }

  return successResult(mapSupabaseRowToUserAlert(data));
};

export const deleteUserAlert = async (
  userId: string,
  alertId: string,
): Promise<ServiceResult<null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { error } = await client
    .from("user_alerts")
    .delete()
    .eq("user_id", userId)
    .eq("id", alertId);

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "delete_user_alert_failed");
  }

  return successResult(null);
};
