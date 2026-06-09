import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";
import { derivePageFreshnessStatus } from "@/utils/financial-data/derivePageFreshnessStatus";

export type DataSourceDetailKey =
  | "fmpLive"
  | "finnhubFallback"
  | "partialFallback"
  | "mockFallback"
  | "rateLimited"
  | "missingKey"
  | "providerError";

export type DataSourceSummary = {
  status: DataFreshnessStatus;
  detailKey: DataSourceDetailKey;
};

const resolveDetailKey = (
  bundles: Record<string, StockProviderDataBundle>,
): DataSourceDetailKey => {
  const bundleList = Object.values(bundles);

  if (bundleList.length === 0) {
    return "mockFallback";
  }

  const fallbackReasons = bundleList
    .map((bundle) => bundle.meta.fallbackReason)
    .filter(Boolean);

  if (fallbackReasons.includes("rateLimited")) {
    return "rateLimited";
  }

  if (fallbackReasons.includes("missingKey")) {
    return "missingKey";
  }

  if (fallbackReasons.includes("providerError")) {
    return "providerError";
  }

  const allFallback = bundleList.every((bundle) => bundle.meta.isFallback);
  if (allFallback) {
    return "mockFallback";
  }

  const hasFinnhubSection = bundleList.some((bundle) =>
    Object.values(bundle.meta.sectionProviders ?? {}).includes("finnhub"),
  );
  const hasPartialFallback = bundleList.some(
    (bundle) =>
      bundle.meta.isFallback ||
      (bundle.meta.fallbackSections?.length ?? 0) > 0 ||
      (bundle.meta.missingDataSections?.length ?? 0) > 0,
  );

  if (hasFinnhubSection && !hasPartialFallback) {
    return "finnhubFallback";
  }

  if (hasPartialFallback) {
    return "partialFallback";
  }

  return "fmpLive";
};

export const deriveDataSourceSummary = (
  bundles: Record<string, StockProviderDataBundle>,
  isLoading = false,
): DataSourceSummary => ({
  status: derivePageFreshnessStatus(bundles, isLoading),
  detailKey: resolveDetailKey(bundles),
});

export const deriveDataSourceSummaryFromBundle = (
  bundle: StockProviderDataBundle | undefined,
  isLoading = false,
): DataSourceSummary => {
  if (!bundle) {
    return { status: isLoading ? "loading" : "mock", detailKey: "mockFallback" };
  }

  return deriveDataSourceSummary({ [bundle.symbol]: bundle }, isLoading);
};
