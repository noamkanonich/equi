import type { PortfolioHolding, PortfolioHoldingFormInput } from "@/data/portfolio/portfolio.types";
import type { ServiceResult } from "@/data/supabase/supabase.types";
import {
  mapPortfolioHoldingFormToSupabaseInsert,
  mapPortfolioHoldingToSupabaseRow,
  mapSupabaseRowToPortfolioHolding,
} from "@/services/user-data/mappers";
import {
  errorResult,
  getUserDataClient,
  noOpResult,
  resolveSupabaseError,
  successResult,
} from "@/services/user-data/serviceUtils";

export const loadPortfolioHoldings = async (
  userId: string,
): Promise<ServiceResult<PortfolioHolding[]>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { data, error } = await client
    .from("portfolio_holdings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "load_portfolio_failed");
  }

  return successResult((data ?? []).map(mapSupabaseRowToPortfolioHolding));
};

export const createPortfolioHolding = async (
  userId: string,
  holding: PortfolioHolding,
): Promise<ServiceResult<PortfolioHolding>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapPortfolioHoldingToSupabaseRow(userId, holding);
  const { data, error } = await client
    .from("portfolio_holdings")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "create_portfolio_holding_failed");
  }

  return successResult(mapSupabaseRowToPortfolioHolding(data));
};

export const createPortfolioHoldingFromInput = async (
  userId: string,
  holdingId: string,
  input: PortfolioHoldingFormInput,
): Promise<ServiceResult<PortfolioHolding>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapPortfolioHoldingFormToSupabaseInsert(userId, holdingId, input);
  const { data, error } = await client
    .from("portfolio_holdings")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "create_portfolio_holding_failed");
  }

  return successResult(mapSupabaseRowToPortfolioHolding(data));
};

export const updatePortfolioHolding = async (
  userId: string,
  holdingId: string,
  holding: PortfolioHolding,
): Promise<ServiceResult<PortfolioHolding>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const row = mapPortfolioHoldingToSupabaseRow(userId, holding);
  const { data, error } = await client
    .from("portfolio_holdings")
    .update({
      symbol: row.symbol,
      shares: row.shares,
      average_cost: row.average_cost,
      purchase_currency: row.purchase_currency,
      purchase_date: row.purchase_date,
      account_name: row.account_name,
      account_type: row.account_type,
      target_allocation_percent: row.target_allocation_percent,
      strategy_tag: row.strategy_tag,
      notes: row.notes,
    })
    .eq("user_id", userId)
    .eq("id", holdingId)
    .select("*")
    .single();

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "update_portfolio_holding_failed");
  }

  return successResult(mapSupabaseRowToPortfolioHolding(data));
};

export const deletePortfolioHolding = async (
  userId: string,
  holdingId: string,
): Promise<ServiceResult<null>> => {
  const client = getUserDataClient(userId);
  if (!client) {
    return noOpResult();
  }

  const { error } = await client
    .from("portfolio_holdings")
    .delete()
    .eq("user_id", userId)
    .eq("id", holdingId);

  if (error) {
    return errorResult(resolveSupabaseError(error) ?? "delete_portfolio_holding_failed");
  }

  return successResult(null);
};
