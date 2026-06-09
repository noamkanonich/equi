import type { FinancialDataProviderId } from "@/data/financial-data/financial-data.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { isFinnhubConfigured } from "./finnhub/finnhub.client";
import { finnhubStockProvider } from "./finnhub/finnhub.provider";
import { isFmpConfigured } from "./fmp/fmp.client";
import { fmpStockProvider } from "./fmp/fmp.provider";
import type { StockDataProvider } from "./types";

export type { StockDataProvider } from "./types";

export { isFmpConfigured } from "./fmp/fmp.client";
export { isFinnhubConfigured } from "./finnhub/finnhub.client";

export type ResolvedStockProviders = {
  primary: StockDataProvider | null;
  fallback: StockDataProvider | null;
};

export const getFinnhubStockProvider = (): StockDataProvider | null => {
  if (!isFinnhubConfigured()) {
    return null;
  }
  return finnhubStockProvider;
};

const resolveProviderId = (): FinancialDataProviderId => {
  const configured = process.env.FINANCIAL_DATA_PROVIDER?.trim().toLowerCase();
  if (configured === "finnhub") {
    return "finnhub";
  }
  if (configured === "mock") {
    return "mock";
  }
  return "fmp";
};

/** FMP when keyed, else Finnhub when keyed, else null (mock-only). */
export const resolveStockProviders = (): ResolvedStockProviders => {
  const configuredProvider = resolveProviderId();

  if (configuredProvider === "mock") {
    return { primary: null, fallback: null };
  }

  const fmp = isFmpConfigured() ? fmpStockProvider : null;
  const finnhub = getFinnhubStockProvider();

  if (configuredProvider === "finnhub") {
    return { primary: finnhub, fallback: null };
  }

  if (fmp) {
    return { primary: fmp, fallback: finnhub };
  }

  return { primary: finnhub, fallback: null };
};

/** @deprecated Use resolveStockProviders — returns primary provider only. */
export const getActiveStockProvider = (): StockDataProvider | null => {
  return resolveStockProviders().primary;
};

export const getActiveProviderId = (): FinancialDataProviderId => {
  const { primary, fallback } = resolveStockProviders();
  if (primary) {
    return primary.id;
  }
  if (fallback) {
    return fallback.id;
  }

  logFinancialDataDebug("provider.resolve", { activeProvider: "mock" });
  return "mock";
};
