import "server-only";

import type { StockSearchResultItem } from "@/data/financial-data/search.types";
import type { Asset } from "@/data/market/market.types";
import { resolveAssetForQuote } from "@/lib/financial-data/quotes/resolveAssetForQuote";
import { getTaseAssets, syncTaseAssets } from "@/lib/financial-data/providers/tase/tase.provider";
import { resolveTaseMetadataFromRaw } from "@/lib/financial-data/providers/tase/mappers";

const normalizeSearchText = (value: string): string => value.trim().toLowerCase();

export const mapStockSearchResultToAsset = (
  result: StockSearchResultItem,
  provider: Asset["provider"],
): Asset => {
  const symbol = result.symbol.trim().toUpperCase();

  return {
    id: result.assetId ?? `US:${symbol}`,
    symbol,
    displaySymbol: result.displaySymbol ?? symbol,
    name: result.companyName,
    market: result.market ?? "US",
    exchange: result.exchange,
    currency: result.currency ?? "USD",
    assetType: result.assetType ?? "stock",
    provider,
    providerSymbol: result.providerSymbol ?? symbol,
  };
};

export const mapAssetToStockSearchResult = (asset: Asset): StockSearchResultItem => {
  const rawMetadata = resolveTaseMetadataFromRaw(asset.raw);

  return {
    assetId: asset.id,
    symbol: asset.symbol,
    displaySymbol: asset.displaySymbol,
    companyName: asset.name,
    exchange: asset.exchange,
    currency: asset.currency,
    market: asset.market,
    assetType: asset.assetType,
    provider: asset.provider,
    providerSymbol: asset.providerSymbol,
    hasLivePrice: asset.market === "US",
    sector: asset.sector ?? rawMetadata.sector,
    industry: asset.industry ?? rawMetadata.industry,
  };
};

const dedupeAssetsById = (assets: Asset[]): Asset[] => {
  const byId = new Map<string, Asset>();

  for (const asset of assets) {
    if (!byId.has(asset.id)) {
      byId.set(asset.id, asset);
    }
  }

  return [...byId.values()];
};

const sortAssets = (assets: Asset[], query = ""): Asset[] => {
  const normalizedQuery = normalizeSearchText(query);

  return [...assets].sort((first, second) => {
    const firstExact = normalizeSearchText(first.displaySymbol) === normalizedQuery;
    const secondExact = normalizeSearchText(second.displaySymbol) === normalizedQuery;

    if (firstExact !== secondExact) {
      return firstExact ? -1 : 1;
    }

    if (first.market !== second.market) {
      return first.market === "US" ? -1 : 1;
    }

    return first.displaySymbol.localeCompare(second.displaySymbol);
  });
};

const assetMatchesQuery = (asset: Asset, query: string): boolean => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  return [
    asset.symbol,
    asset.displaySymbol,
    asset.name,
    asset.providerSymbol,
    asset.sector,
    asset.industry,
    asset.market,
    asset.exchange,
    asset.assetType,
  ].some((value) => value && normalizeSearchText(value).includes(normalizedQuery));
};

export const getUnifiedAssets = async (usAssets: Asset[] = []): Promise<Asset[]> => {
  const taseAssets = await getTaseAssets();

  return sortAssets(dedupeAssetsById([...usAssets, ...taseAssets]));
};

export const refreshUnifiedAssets = async (
  usAssets: Asset[] = [],
): Promise<Asset[]> => {
  const taseAssets = await syncTaseAssets();

  return sortAssets(dedupeAssetsById([...usAssets, ...taseAssets]));
};

export const searchAssets = async (
  query: string,
  usAssets: Asset[] = [],
): Promise<Asset[]> => {
  const assets = await getUnifiedAssets(usAssets);
  const matches = assets.filter((asset) => assetMatchesQuery(asset, query));

  return sortAssets(matches, query);
};

export const findAssetBySymbol = async (symbol: string): Promise<Asset | null> =>
  resolveAssetForQuote(symbol);
