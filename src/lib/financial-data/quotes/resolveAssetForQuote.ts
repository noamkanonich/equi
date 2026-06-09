import "server-only";

import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { Asset } from "@/data/market/market.types";
import { getUnifiedAssets } from "@/lib/financial-data/asset-registry";

const US_TICKER_PATTERN = /^[A-Z][A-Z0-9.-]{0,9}$/;

const matchesAssetSymbol = (asset: Asset, normalized: string): boolean => {
  const candidates = [
    asset.symbol,
    asset.displaySymbol,
    asset.providerSymbol,
    asset.id,
    `US:${normalized}`,
    `IL:TASE:${normalized}`,
  ].map((value) => value.trim().toUpperCase());

  return candidates.includes(normalized);
};

const buildSyntheticUsAsset = (symbol: string): Asset => ({
  id: `US:${symbol}`,
  symbol,
  displaySymbol: symbol,
  name: symbol,
  market: "US",
  exchange: "NASDAQ",
  currency: "USD",
  assetType: "stock",
  provider: "fmp",
  providerSymbol: symbol,
});

export const resolveAssetForQuote = async (symbol: string): Promise<Asset | null> => {
  const normalized = normalizeProviderSymbol(symbol);
  const assets = await getUnifiedAssets();
  const registryMatch = assets.find((asset) => matchesAssetSymbol(asset, normalized));

  if (registryMatch) {
    return registryMatch;
  }

  if (US_TICKER_PATTERN.test(normalized)) {
    return buildSyntheticUsAsset(normalized);
  }

  return null;
};
