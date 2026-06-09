import type {
  FinancialDataMeta,
  FinancialDataSection,
  StockProviderDataBundle,
} from "@/data/financial-data/financial-data.types";
import { buildFinancialDataMeta } from "@/data/financial-data/mappers";

const applySectionToBundle = (
  target: StockProviderDataBundle,
  source: StockProviderDataBundle,
  section: FinancialDataSection,
): void => {
  switch (section) {
    case "profile":
      target.profile = source.profile;
      break;
    case "quote":
      target.quote = source.quote;
      break;
    case "keyMetrics":
      target.keyMetrics = source.keyMetrics;
      break;
    case "incomeStatements":
      target.incomeStatements = source.incomeStatements;
      break;
    case "cashFlowStatements":
      target.cashFlowStatements = source.cashFlowStatements;
      break;
    case "priceHistory":
      target.priceHistory = source.priceHistory;
      break;
    case "intraday":
      target.intraday = source.intraday;
      break;
    case "news":
      target.news = source.news;
      break;
    case "earnings":
      target.earnings = source.earnings;
      break;
    case "analystTarget":
      target.analystTarget = source.analystTarget;
      break;
    case "analystRatings":
      target.analystRatings = source.analystRatings;
      break;
    default:
      break;
  }
};

const mergeFinancialDataMeta = (
  existing: FinancialDataMeta | undefined,
  incoming: FinancialDataMeta,
  requestedSections: FinancialDataSection[],
): FinancialDataMeta => {
  if (!existing) {
    return incoming;
  }

  const availableSet = new Set([
    ...(existing.availableDataSections ?? []),
    ...(incoming.availableDataSections ?? []),
  ]);
  const missingSet = new Set([
    ...(existing.missingDataSections ?? []),
    ...(incoming.missingDataSections ?? []),
  ]);

  for (const section of requestedSections) {
    if (incoming.availableDataSections?.includes(section)) {
      missingSet.delete(section);
      availableSet.add(section);
    } else if (incoming.missingDataSections?.includes(section)) {
      availableSet.delete(section);
      missingSet.add(section);
    }
  }

  const sectionProviders = {
    ...existing.sectionProviders,
    ...incoming.sectionProviders,
  };

  return buildFinancialDataMeta({
    provider: incoming.isFallback ? incoming.provider : existing.provider,
    source: incoming.isFallback && !existing.isFallback ? existing.source : incoming.source,
    isFallback: existing.isFallback && incoming.isFallback,
    availableDataSections: [...availableSet],
    missingDataSections: [...missingSet],
    fallbackSections: incoming.fallbackSections ?? existing.fallbackSections,
    fallbackReason: incoming.fallbackReason ?? existing.fallbackReason,
    fetchedAt: incoming.fetchedAt,
    sectionProviders:
      Object.keys(sectionProviders).length > 0 ? sectionProviders : undefined,
    cachedAt: incoming.cachedAt ?? existing.cachedAt,
    cacheExpiresAt: incoming.cacheExpiresAt ?? existing.cacheExpiresAt,
  });
};

/** Merges only requested sections from incoming into existing — avoids mock overwrites on partial fetches. */
export const mergeStockDataBundles = (
  existing: StockProviderDataBundle | undefined,
  incoming: StockProviderDataBundle,
  requestedSections: FinancialDataSection[],
): StockProviderDataBundle => {
  if (!existing || requestedSections.length === 0) {
    return incoming;
  }

  const merged: StockProviderDataBundle = {
    ...existing,
    symbol: incoming.symbol,
    meta: mergeFinancialDataMeta(existing.meta, incoming.meta, requestedSections),
  };

  for (const section of requestedSections) {
    applySectionToBundle(merged, incoming, section);
  }

  return merged;
};

export const buildSectionFetchTimestamps = (
  requestedSections: FinancialDataSection[],
  fetchedAt: string,
): Partial<Record<FinancialDataSection, string>> => {
  const timestamps: Partial<Record<FinancialDataSection, string>> = {};
  for (const section of requestedSections) {
    timestamps[section] = fetchedAt;
  }
  return timestamps;
};
