import "server-only";

import { subYears } from "date-fns";
import type {
  StockProviderPriceHistory,
  StockProviderPricePoint,
} from "@/data/financial-data/financial-data.types";
import type { Asset } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";

type NasdaqHistoricalRow = {
  date?: string;
  close?: string;
  volume?: string;
  open?: string;
  high?: string;
  low?: string;
};

type NasdaqHistoricalResponse = {
  data?: {
    tradesTable?: {
      rows?: NasdaqHistoricalRow[];
    };
  } | null;
  status?: {
    rCode?: number;
  };
};

const NASDAQ_TIMEOUT_MS = 10_000;

const formatNasdaqDate = (date: Date): string => date.toISOString().slice(0, 10);

const parseNasdaqNumber = (value?: string): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value.replace(/[$,]/g, ""));

  return Number.isFinite(parsed) ? parsed : null;
};

const parseNasdaqDate = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  const [month, day, year] = value.split("/");

  if (!month || !day || !year) {
    return null;
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const buildNasdaqHistoricalUrl = (symbol: string): string => {
  const to = new Date();
  const from = subYears(to, 1);
  const params = new URLSearchParams({
    assetclass: "stocks",
    fromdate: formatNasdaqDate(from),
    todate: formatNasdaqDate(to),
    limit: "260",
  });

  return `https://api.nasdaq.com/api/quote/${encodeURIComponent(symbol)}/historical?${params.toString()}`;
};

const mapNasdaqRowsToPricePoints = (
  rows: NasdaqHistoricalRow[],
): StockProviderPricePoint[] =>
  rows
    .flatMap((row) => {
      const date = parseNasdaqDate(row.date);
      const open = parseNasdaqNumber(row.open);
      const high = parseNasdaqNumber(row.high);
      const low = parseNasdaqNumber(row.low);
      const close = parseNasdaqNumber(row.close);

      if (!date || open === null || high === null || low === null || close === null) {
        return [];
      }

      return {
        date,
        open,
        high,
        low,
        close,
        volume: parseNasdaqNumber(row.volume) ?? 0,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

export const getNasdaqHistoricalPriceHistory = async (
  asset: Asset,
): Promise<StockProviderPriceHistory | null> => {
  if (asset.market !== "US") {
    return null;
  }

  const symbol = asset.symbol.trim().toUpperCase();
  const response = await fetch(buildNasdaqHistoricalUrl(symbol), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Origin: "https://www.nasdaq.com",
      Referer: `https://www.nasdaq.com/market-activity/stocks/${symbol.toLowerCase()}/historical`,
    },
    signal: AbortSignal.timeout(NASDAQ_TIMEOUT_MS),
    cache: "no-store",
  }).catch((error: unknown) => {
    logFinancialDataDebug("scraper.nasdaqHistorical.fetchError", {
      symbol,
      errorMessage: error instanceof Error ? error.message.slice(0, 120) : "fetch failed",
    });

    return null;
  });

  if (!response?.ok) {
    logFinancialDataDebug("scraper.nasdaqHistorical.fetchFailed", {
      symbol,
      status: response?.status,
    });
    return null;
  }

  const payload = (await response.json()) as NasdaqHistoricalResponse;
  const rows = payload.data?.tradesTable?.rows ?? [];
  const points = mapNasdaqRowsToPricePoints(rows);

  if (points.length === 0) {
    return null;
  }

  logFinancialDataDebug("scraper.nasdaqHistorical.success", {
    symbol,
    points: points.length,
  });

  return {
    symbol,
    currency: asset.currency,
    points,
  };
};
