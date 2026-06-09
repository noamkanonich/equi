import type { AllocationReportItem, AllocationSectorDetail } from "@/data/reports/reports.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

export const buildAllocationSectorDetails = (
  allocation: AllocationReportItem[],
  holdings: EnrichedPortfolioHolding[],
): AllocationSectorDetail[] => {
  if (holdings.length === 0) {
    return allocation.map((item) => ({ ...item, holdings: [] }));
  }

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);

  return allocation.map((item) => {
    const sectorHoldings = holdings.filter((h) => h.sector === item.key);
    const sectorTotalValue = sectorHoldings.reduce((sum, h) => sum + h.marketValue, 0);

    return {
      ...item,
      holdings: sectorHoldings.map((h) => ({
        symbol: h.symbol,
        companyName: h.companyName,
        weightPercent:
          totalPortfolioValue > 0
            ? Number(((h.marketValue / totalPortfolioValue) * 100).toFixed(1))
            : 0,
        sectorWeightPercent:
          sectorTotalValue > 0
            ? Number(((h.marketValue / sectorTotalValue) * 100).toFixed(1))
            : 0,
      })),
    };
  });
};
