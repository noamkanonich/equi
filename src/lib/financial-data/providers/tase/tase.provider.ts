import "server-only";

import type { Asset } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import {
  getTaseAssetsCache,
  isTaseAssetsCacheFresh,
  saveTaseAssetsCache,
} from "./tase.cache";
import { fetchTaseJson, TaseProviderError } from "./tase.client";
import { getTaseEndpointUrl } from "./tase.endpoints";
import {
  normalizeTaseFunds,
  normalizeTaseIndices,
  normalizeTaseSecurities,
} from "./mappers";

let taseRefreshPromise: Promise<Asset[]> | null = null;

export const fetchTaseSecurities = async (): Promise<unknown> =>
  fetchTaseJson(getTaseEndpointUrl("TASE_SECURITIES_BASIC_URL"));

export const fetchTaseIndices = async (): Promise<unknown> =>
  fetchTaseJson(getTaseEndpointUrl("TASE_INDICES_BASIC_URL"));

export const fetchTaseFunds = async (): Promise<unknown> =>
  fetchTaseJson(getTaseEndpointUrl("TASE_FUNDS_BASIC_URL"));

const logTaseProductFailure = (
  product: "securities" | "indices" | "funds",
  reason: unknown,
): void => {
  logFinancialDataDebug("tase.product.failed", {
    product,
    message: reason instanceof Error ? reason.message : "Unknown TASE product error",
    status: reason instanceof TaseProviderError ? reason.status : undefined,
  });
};

const normalizeSettledProduct = (
  product: "securities" | "indices" | "funds",
  result: PromiseSettledResult<unknown>,
): Asset[] => {
  if (result.status === "rejected") {
    logTaseProductFailure(product, result.reason);
    return [];
  }

  const assets =
    product === "securities"
      ? normalizeTaseSecurities(result.value)
      : product === "indices"
        ? normalizeTaseIndices(result.value)
        : normalizeTaseFunds(result.value);

  logFinancialDataDebug("tase.product.normalized", {
    product,
    count: assets.length,
  });

  return assets;
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

export const syncTaseAssets = async (): Promise<Asset[]> => {
  logFinancialDataDebug("tase.sync.start", {});

  const [securities, indices, funds] = await Promise.allSettled([
    fetchTaseSecurities(),
    fetchTaseIndices(),
    fetchTaseFunds(),
  ]);

  const assets = dedupeAssetsById([
    ...normalizeSettledProduct("securities", securities),
    ...normalizeSettledProduct("indices", indices),
    ...normalizeSettledProduct("funds", funds),
  ]);

  logFinancialDataDebug("tase.sync.complete", { count: assets.length });

  if (assets.length > 0) {
    await saveTaseAssetsCache(assets);
  }

  return assets;
};

export const getTaseAssets = async (): Promise<Asset[]> => {
  const cachedAssets = await getTaseAssetsCache();
  const isFresh = await isTaseAssetsCacheFresh();

  if (cachedAssets.length > 0 && isFresh) {
    return cachedAssets;
  }

  if (cachedAssets.length > 0) {
    logFinancialDataDebug("tase.cache.stale", { count: cachedAssets.length });

    if (!taseRefreshPromise) {
      taseRefreshPromise = syncTaseAssets().finally(() => {
        taseRefreshPromise = null;
      });
    }

    return cachedAssets;
  }

  if (taseRefreshPromise) {
    return taseRefreshPromise;
  }

  taseRefreshPromise = syncTaseAssets().finally(() => {
    taseRefreshPromise = null;
  });

  try {
    return await taseRefreshPromise;
  } catch (error) {
    logTaseProductFailure("securities", error);
    return [];
  }
};

export const syncTaseEodPrices = async (): Promise<void> => {
  throw new Error("TASE EoD prices are not implemented yet");
};
