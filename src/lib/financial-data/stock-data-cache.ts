import "server-only";

import type {
  FinancialDataFallbackReason,
  FinancialDataSection,
} from "@/data/financial-data/financial-data.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  isFallback: boolean;
  fallbackReason?: FinancialDataFallbackReason;
};

const SECTION_TTL_MS: Record<FinancialDataSection, number> = {
  quote: 5 * 60 * 1000,
  profile: 24 * 60 * 60 * 1000,
  keyMetrics: 24 * 60 * 60 * 1000,
  incomeStatements: 24 * 60 * 60 * 1000,
  cashFlowStatements: 24 * 60 * 60 * 1000,
  priceHistory: 15 * 60 * 1000,
  intraday: 15 * 60 * 1000,
  news: 60 * 60 * 1000,
  earnings: 6 * 60 * 60 * 1000,
  analystTarget: 6 * 60 * 60 * 1000,
  analystRatings: 6 * 60 * 60 * 1000,
};

const FALLBACK_TTL_MS = 60 * 1000;
const RATE_LIMIT_COOLDOWN_MS = 60 * 1000;

const sectionCache = new Map<string, CacheEntry<unknown>>();

let rateLimitedUntil = 0;

const buildCacheKey = (symbol: string, section: FinancialDataSection): string =>
  `${symbol.toUpperCase()}:${section}`;

export const isRateLimitCooldownActive = (): boolean =>
  Date.now() < rateLimitedUntil;

export const setRateLimitCooldown = (): void => {
  rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
  logFinancialDataDebug("cache.rateLimit", {
    cooldownMs: RATE_LIMIT_COOLDOWN_MS,
    until: new Date(rateLimitedUntil).toISOString(),
  });
};

export type CachedSectionResult<T> = {
  value: T;
  isFallback: boolean;
  fallbackReason?: FinancialDataFallbackReason;
};

export const getCachedSection = <T>(
  symbol: string,
  section: FinancialDataSection,
): CachedSectionResult<T> | undefined => {
  const key = buildCacheKey(symbol, section);
  const entry = sectionCache.get(key);

  if (!entry || Date.now() >= entry.expiresAt) {
    if (entry) {
      sectionCache.delete(key);
    }
    return undefined;
  }

  return {
    value: entry.value as T,
    isFallback: entry.isFallback,
    fallbackReason: entry.fallbackReason,
  };
};

export const setCachedSection = <T>(
  symbol: string,
  section: FinancialDataSection,
  value: T,
  options?: {
    isFallback?: boolean;
    fallbackReason?: FinancialDataFallbackReason;
    ttlMs?: number;
  },
): void => {
  const key = buildCacheKey(symbol, section);
  const isFallback = options?.isFallback ?? false;
  const ttlMs = options?.ttlMs ?? (isFallback ? FALLBACK_TTL_MS : SECTION_TTL_MS[section]);

  sectionCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
    isFallback,
    fallbackReason: options?.fallbackReason,
  });
};

export type BatchCacheStats = {
  requestedCount: number;
  uniqueSymbols: string[];
  requestedSections: FinancialDataSection[];
  cacheHitSymbols: string[];
  cacheMissSymbols: string[];
  providerCallCount: number;
  fallbacks: Array<{ symbol: string; reason: FinancialDataFallbackReason }>;
};

const batchStats: BatchCacheStats = {
  requestedCount: 0,
  uniqueSymbols: [],
  requestedSections: [],
  cacheHitSymbols: [],
  cacheMissSymbols: [],
  providerCallCount: 0,
  fallbacks: [],
};

export const resetBatchCacheStats = (
  requestedSymbols: string[],
  uniqueSymbols: string[],
  requestedSections: FinancialDataSection[] = [],
): void => {
  batchStats.requestedCount = requestedSymbols.length;
  batchStats.uniqueSymbols = uniqueSymbols;
  batchStats.requestedSections = requestedSections;
  batchStats.cacheHitSymbols = [];
  batchStats.cacheMissSymbols = [];
  batchStats.providerCallCount = 0;
  batchStats.fallbacks = [];
};

export const recordCacheHit = (symbol: string): void => {
  const normalized = symbol.toUpperCase();
  if (!batchStats.cacheHitSymbols.includes(normalized)) {
    batchStats.cacheHitSymbols.push(normalized);
  }
};

export const recordCacheMiss = (symbol: string): void => {
  const normalized = symbol.toUpperCase();
  if (!batchStats.cacheMissSymbols.includes(normalized)) {
    batchStats.cacheMissSymbols.push(normalized);
  }
};

export const incrementProviderCalls = (count = 1): void => {
  batchStats.providerCallCount += count;
};

export const recordFallback = (
  symbol: string,
  reason: FinancialDataFallbackReason,
): void => {
  batchStats.fallbacks.push({ symbol: symbol.toUpperCase(), reason });
};

export const logBatchCacheStats = (): void => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const sectionsLabel =
    batchStats.requestedSections.length > 0
      ? [...batchStats.requestedSections].sort().join(",")
      : "display";

  console.info(`[financial-data] sections requested: ${sectionsLabel}`);

  if (batchStats.cacheHitSymbols.length > 0) {
    console.info(
      `[financial-data] cache hits: [${batchStats.cacheHitSymbols.join(", ")}]`,
    );
  }

  if (batchStats.cacheMissSymbols.length > 0) {
    console.info(
      `[financial-data] cache misses: [${batchStats.cacheMissSymbols.join(", ")}]`,
    );
  }

  console.info(
    `[financial-data] external provider calls: ${batchStats.providerCallCount}`,
  );

  if (batchStats.fallbacks.length > 0) {
    const reasons = batchStats.fallbacks.map(
      (fallback) => `${fallback.symbol}:${fallback.reason}`,
    );
    console.info(`[financial-data] fallback reasons: [${reasons.join(", ")}]`);
  }
};

export const getSectionsForScope = (
  scope: "full" | "display",
): FinancialDataSection[] => {
  if (scope === "display") {
    return ["profile", "quote"];
  }

  return [
    "profile",
    "quote",
    "keyMetrics",
    "incomeStatements",
    "cashFlowStatements",
    "priceHistory",
    "intraday",
    "news",
    "earnings",
    "analystTarget",
  ];
};

export const resolveRequestedSections = (input: {
  scope?: "full" | "display";
  sections?: FinancialDataSection[];
}): FinancialDataSection[] => {
  if (input.sections && input.sections.length > 0) {
    return [...new Set(input.sections)];
  }

  return getSectionsForScope(input.scope ?? "display");
};
