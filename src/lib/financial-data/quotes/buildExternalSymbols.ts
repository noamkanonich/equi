import "server-only";

import type { Asset } from "@/data/market/market.types";

const dedupeSymbols = (symbols: string[]): string[] => {
  const seen = new Set<string>();

  return symbols.filter((symbol) => {
    const normalized = symbol.trim();

    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
};

const isAlphabeticTicker = (value: string): boolean => /^[A-Za-z][A-Za-z0-9.-]*$/.test(value);

const isNumericSecurityId = (value: string): boolean => /^\d+$/.test(value);

export const buildYahooFinanceSymbols = (asset: Asset): string[] => {
  if (asset.market === "US") {
    return dedupeSymbols([asset.symbol, asset.providerSymbol]);
  }

  const symbols: string[] = [];
  const displaySymbol = asset.displaySymbol.trim();

  if (displaySymbol.toUpperCase().endsWith(".TA")) {
    symbols.push(displaySymbol.toUpperCase());
  } else if (isAlphabeticTicker(asset.symbol)) {
    symbols.push(`${asset.symbol.toUpperCase()}.TA`);
  }

  if (isNumericSecurityId(asset.providerSymbol)) {
    symbols.push(`${asset.providerSymbol}.TA`);
  }

  return dedupeSymbols(symbols);
};

export const buildGoogleFinanceSymbols = (asset: Asset): string[] => {
  if (asset.market === "US") {
    const symbol = asset.symbol.trim().toUpperCase();
    const exchange = asset.exchange.trim().toUpperCase();

    if (exchange === "NASDAQ") {
      return dedupeSymbols([`NASDAQ:${symbol}`, symbol]);
    }

    if (exchange === "NYSE") {
      return dedupeSymbols([`NYSE:${symbol}`, symbol]);
    }

    return dedupeSymbols([symbol]);
  }

  return dedupeSymbols([
    `TASE:${asset.displaySymbol}`,
    `TASE:${asset.symbol}`,
    `TASE:${asset.providerSymbol}`,
  ]);
};
