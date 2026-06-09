import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";

export const derivePageFreshnessStatus = (
  bundles: Record<string, StockProviderDataBundle>,
  isLoading = false,
): DataFreshnessStatus => {
  if (isLoading) {
    return "loading";
  }

  const bundleList = Object.values(bundles);

  if (bundleList.length === 0) {
    return "mock";
  }

  const allFallback = bundleList.every((bundle) => bundle.meta.isFallback);
  if (allFallback) {
    return "mock";
  }

  const anyPartialFallback = bundleList.some(
    (bundle) =>
      bundle.meta.isFallback ||
      bundle.meta.fallbackReason === "rateLimited" ||
      (bundle.meta.fallbackSections?.length ?? 0) > 0 ||
      (bundle.meta.missingDataSections?.length ?? 0) > 0,
  );

  if (anyPartialFallback) {
    return "stale";
  }

  return "live";
};
