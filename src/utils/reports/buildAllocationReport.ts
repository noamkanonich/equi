import type { AllocationReportItem } from "@/data/reports/reports.types";
import type {
  EnrichedPortfolioHolding,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";
import { mapHoldingsToAllocation, mapHoldingsToView } from "@/data/portfolio/mappers";

export const buildAllocationReport = (
  holdings: EnrichedPortfolioHolding[],
  summary: PortfolioSummary,
): AllocationReportItem[] => {
  if (holdings.length === 0 && summary.cashAvailable === 0) {
    return [];
  }

  const holdingViews = mapHoldingsToView(holdings, summary.totalValue);
  const segments = mapHoldingsToAllocation(holdingViews, summary);

  return segments
    .filter((segment) => segment.value > 0)
    .map((segment) => ({
      key: segment.key,
      percent: Number(segment.value.toFixed(1)),
      value: Number(
        ((segment.value / 100) * summary.totalValue).toFixed(2),
      ),
    }));
};
