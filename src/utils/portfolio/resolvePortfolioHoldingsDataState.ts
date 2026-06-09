import type { DataState } from "@/data/ui/ui-state.types";

/** Show table skeleton only before the first holdings snapshot exists — not while quote fetches run. */
export const resolvePortfolioHoldingsDataState = (
  holdingsCount: number,
  isPortfolioQuotesLoading: boolean,
): DataState | undefined => {
  if (holdingsCount === 0 && isPortfolioQuotesLoading) {
    return "loading";
  }

  return undefined;
};
