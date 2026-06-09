import "server-only";

import type { Asset } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { TASE_ASSETS_CACHE_KEY } from "./tase.endpoints";

export const TASE_ASSETS_CACHE_VERSION = 3;

export type TaseAssetsCache = {
  version: number;
  updatedAt: string;
  source: "tase";
  assets: Asset[];
};

let taseAssetsCache: TaseAssetsCache | null = null;

const isCacheVersionCurrent = (cache: TaseAssetsCache | null): cache is TaseAssetsCache =>
  Boolean(cache && cache.version === TASE_ASSETS_CACHE_VERSION);

const isSameCalendarDay = (isoDate: string): boolean => {
  const cachedDate = new Date(isoDate);
  const now = new Date();

  return cachedDate.toDateString() === now.toDateString();
};

export const saveTaseAssetsCache = async (assets: Asset[]): Promise<void> => {
  taseAssetsCache = {
    version: TASE_ASSETS_CACHE_VERSION,
    updatedAt: new Date().toISOString(),
    source: "tase",
    assets,
  };

  logFinancialDataDebug("tase.cache.save", {
    cacheKey: TASE_ASSETS_CACHE_KEY,
    count: assets.length,
  });
};

export const getTaseAssetsCache = async (): Promise<Asset[]> => {
  if (!isCacheVersionCurrent(taseAssetsCache)) {
    logFinancialDataDebug("tase.cache.miss", {
      cacheKey: TASE_ASSETS_CACHE_KEY,
      reason: taseAssetsCache ? "version_mismatch" : "empty",
    });
    return [];
  }

  logFinancialDataDebug("tase.cache.hit", {
    cacheKey: TASE_ASSETS_CACHE_KEY,
    count: taseAssetsCache.assets.length,
    updatedAt: taseAssetsCache.updatedAt,
  });

  return taseAssetsCache.assets;
};

export const isTaseAssetsCacheFresh = async (): Promise<boolean> => {
  if (!isCacheVersionCurrent(taseAssetsCache)) {
    return false;
  }

  return isSameCalendarDay(taseAssetsCache.updatedAt);
};

export const getTaseAssetsCacheMeta = (): TaseAssetsCache | null => taseAssetsCache;
