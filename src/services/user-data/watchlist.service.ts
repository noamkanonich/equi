import type {
  WatchlistItemFormInput,
  WatchlistStoredItem,
} from "@/data/watchlist/watchlist.types";
import type { ServiceResult } from "@/data/supabase/supabase.types";
import {
  mapSupabaseRowToWatchlistItem,
  mapWatchlistFormToSupabaseInsert,
  mapWatchlistItemToSupabaseRow,
} from "@/services/user-data/mappers";
import {
  errorResult,
  getUserDataClient,
  noOpResult,
  resolveSupabaseError,
  successResult,
} from "@/services/user-data/serviceUtils";

export const loadWatchlistItems = async (
  userId: string,
): Promise<ServiceResult<WatchlistStoredItem[]>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { data, error } = await client
    .from("watchlist_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "load_watchlist_failed");
  }

  return successResult((data ?? []).map(mapSupabaseRowToWatchlistItem));
};

export const createWatchlistItem = async (
  userId: string,
  item: WatchlistStoredItem,
): Promise<ServiceResult<WatchlistStoredItem>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapWatchlistItemToSupabaseRow(userId, item);
  const { data, error } = await client
    .from("watchlist_items")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "create_watchlist_item_failed");
  }

  return successResult(mapSupabaseRowToWatchlistItem(data));
};

export const createWatchlistItemFromInput = async (
  userId: string,
  itemId: string,
  input: WatchlistItemFormInput,
): Promise<ServiceResult<WatchlistStoredItem>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapWatchlistFormToSupabaseInsert(userId, itemId, input);
  const { data, error } = await client
    .from("watchlist_items")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "create_watchlist_item_failed");
  }

  return successResult(mapSupabaseRowToWatchlistItem(data));
};

export const updateWatchlistItem = async (
  userId: string,
  itemId: string,
  item: WatchlistStoredItem,
): Promise<ServiceResult<WatchlistStoredItem>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapWatchlistItemToSupabaseRow(userId, item);
  const { data, error } = await client
    .from("watchlist_items")
    .update({
      symbol: row.symbol,
      buy_zone_min: row.buy_zone_min,
      buy_zone_max: row.buy_zone_max,
      target_price: row.target_price,
      priority: row.priority,
      status: row.status,
      notes: row.notes,
    })
    .eq("user_id", userId)
    .eq("id", itemId)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "update_watchlist_item_failed");
  }

  return successResult(mapSupabaseRowToWatchlistItem(data));
};

export const deleteWatchlistItem = async (
  userId: string,
  itemId: string,
): Promise<ServiceResult<null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { error } = await client
    .from("watchlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("id", itemId);

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "delete_watchlist_item_failed");
  }

  return successResult(null);
};
