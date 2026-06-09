import type {
  FinancialDataFallbackReason,
  FinancialDataMeta,
  FinancialDataProviderId,
  FinancialDataSection,
  FinancialDataSource,
} from "./financial-data.types";

export const normalizeProviderSymbol = (symbol: string): string =>
  symbol.trim().toUpperCase();

export const buildFinancialDataMeta = (input: {
  provider: FinancialDataProviderId;
  source: FinancialDataSource;
  isFallback: boolean;
  availableDataSections?: FinancialDataSection[];
  missingDataSections?: FinancialDataSection[];
  sectionProviders?: Partial<Record<FinancialDataSection, FinancialDataSource>>;
  fallbackSections?: FinancialDataSection[];
  fallbackReason?: FinancialDataFallbackReason;
  fetchedAt?: string;
  cachedAt?: string;
  cacheExpiresAt?: string;
}): FinancialDataMeta => ({
  provider: input.provider,
  source: input.source,
  isFallback: input.isFallback,
  fetchedAt: input.fetchedAt ?? new Date().toISOString(),
  availableDataSections: input.availableDataSections,
  missingDataSections: input.missingDataSections,
  sectionProviders: input.sectionProviders,
  fallbackSections: input.fallbackSections,
  fallbackReason: input.fallbackReason,
  cachedAt: input.cachedAt,
  cacheExpiresAt: input.cacheExpiresAt,
});
