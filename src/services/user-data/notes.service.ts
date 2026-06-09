import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";
import type { ServiceResult } from "@/data/supabase/supabase.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";
import {
  mapStockNoteToSupabaseRow,
  mapStockNotesRowsToBundle,
  type StockNotesBundle,
} from "@/services/user-data/mappers";
import {
  errorResult,
  getUserDataClient,
  noOpResult,
  resolveSupabaseError,
  successResult,
} from "@/services/user-data/serviceUtils";

export const loadStockNotes = async (
  userId: string,
): Promise<ServiceResult<StockNotesBundle>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { data, error } = await client
    .from("stock_notes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "load_stock_notes_failed");
  }

  return successResult(mapStockNotesRowsToBundle(data ?? []));
};

export const upsertStockNote = async (
  userId: string,
  symbol: string,
  thesis: StockThesisContent,
  generalNotes: StockGeneralNote[],
  rowId?: string,
): Promise<ServiceResult<null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapStockNoteToSupabaseRow(userId, symbol, thesis, generalNotes, rowId);
  const { error } = await client.from("stock_notes").upsert(
    {
      id: row.id,
      user_id: userId,
      symbol: row.symbol,
      thesis: row.thesis,
      what_to_watch: row.what_to_watch,
      sell_if: row.sell_if,
      general_note: row.general_note,
    },
    { onConflict: "user_id,symbol" },
  );

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "upsert_stock_note_failed");
  }

  return successResult(null);
};

export const deleteStockNote = async (
  userId: string,
  symbol: string,
): Promise<ServiceResult<null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { error } = await client
    .from("stock_notes")
    .delete()
    .eq("user_id", userId)
    .eq("symbol", symbol.trim().toUpperCase());

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "delete_stock_note_failed");
  }

  return successResult(null);
};
