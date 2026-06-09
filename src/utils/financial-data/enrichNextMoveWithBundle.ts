import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { NextMoveItem, UpcomingPortfolioEvent } from "@/data/next-moves/next-moves.types";
import { mergeStockProfileIntoStockItem } from "./mergeStockProfileIntoStockItem";

export const enrichNextMoveWithBundle = (
  move: NextMoveItem,
  bundle: StockProviderDataBundle | undefined,
): NextMoveItem => {
  if (!move.symbol) {
    return move;
  }

  return mergeStockProfileIntoStockItem(
    {
      ...move,
      symbol: move.symbol,
      companyName: move.companyName ?? move.symbol,
      logoUrl: move.logoUrl,
    },
    bundle,
  );
};

export const enrichUpcomingEventWithBundle = (
  event: UpcomingPortfolioEvent,
  bundle: StockProviderDataBundle | undefined,
): UpcomingPortfolioEvent =>
  mergeStockProfileIntoStockItem(event, bundle);
