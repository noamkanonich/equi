import type { FinancialDataSection } from "@/data/financial-data/financial-data.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import {
  CLIENT_SECTION_TTL_MS,
  resolveClientRequestedSections,
} from "@/utils/app-data/clientSectionTtl";
import type { EnsureStockDataOptions } from "@/data/app-data/app-data.types";

/** Legacy global TTL (quote). Prefer section-aware checks. */
export const STOCK_DATA_CLIENT_TTL_MS = CLIENT_SECTION_TTL_MS.quote;

export const areSectionsFresh = (
  lastFetchedSections: Partial<Record<FinancialDataSection, string>> | undefined,
  sections: FinancialDataSection[],
): boolean => {
  if (!lastFetchedSections || sections.length === 0) {
    return false;
  }

  const now = Date.now();

  return sections.every((section) => {
    const fetchedAt = lastFetchedSections[section];
    if (!fetchedAt) {
      return false;
    }

    const fetchedAtMs = Date.parse(fetchedAt);
    if (Number.isNaN(fetchedAtMs)) {
      return false;
    }

    return now - fetchedAtMs < CLIENT_SECTION_TTL_MS[section];
  });
};

export const isStockDataFresh = (
  lastFetchedAt: string | undefined,
  bundle: StockProviderDataBundle | undefined,
  lastFetchedSections?: Partial<Record<FinancialDataSection, string>>,
  options?: EnsureStockDataOptions,
): boolean => {
  if (!bundle) {
    return false;
  }

  const sections = resolveClientRequestedSections({
    scope: options?.scope,
    sections: options?.sections,
  });

  if (lastFetchedSections && sections.length > 0) {
    return areSectionsFresh(lastFetchedSections, sections);
  }

  if (!lastFetchedAt) {
    return false;
  }

  const fetchedAtMs = Date.parse(lastFetchedAt);
  if (Number.isNaN(fetchedAtMs)) {
    return false;
  }

  return Date.now() - fetchedAtMs < STOCK_DATA_CLIENT_TTL_MS;
};
