import type { PortfolioCashBalance } from "@/data/portfolio/portfolio.types";
import type { ServiceResult } from "@/data/supabase/supabase.types";
import {
  mapCashBalanceToSupabaseRow,
  mapSupabaseRowToCashBalance,
} from "@/services/user-data/mappers";
import {
  errorResult,
  getUserDataClient,
  noOpResult,
  resolveSupabaseError,
  successResult,
} from "@/services/user-data/serviceUtils";

export const loadCashBalance = async (
  userId: string,
): Promise<ServiceResult<PortfolioCashBalance | null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { data, error } = await client
    .from("cash_balances")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "load_cash_balance_failed");
  }

  if (!data) {
    return successResult(null);
  }

  return successResult(mapSupabaseRowToCashBalance(data));
};

export const upsertCashBalance = async (
  userId: string,
  cashBalance: PortfolioCashBalance,
): Promise<ServiceResult<PortfolioCashBalance>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapCashBalanceToSupabaseRow(userId, cashBalance);
  const { data, error } = await client
    .from("cash_balances")
    .upsert(
      {
        user_id: userId,
        amount: row.amount,
        currency: row.currency,
      },
      { onConflict: "user_id,currency" },
    )
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "upsert_cash_balance_failed");
  }

  return successResult(mapSupabaseRowToCashBalance(data));
};
