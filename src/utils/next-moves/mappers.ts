import type { NextMoveAction, NextMoveItem } from "@/data/next-moves/next-moves.types";

export const getNextMoveActionHref = (
  move: NextMoveItem,
  action: NextMoveAction = move.action,
): string | undefined => {
  if ((action === "reviewStock" || action === "analyze") && move.symbol) {
    return `/stocks/${move.symbol}`;
  }

  if (action === "viewAllocation") {
    return "/portfolio";
  }

  return undefined;
};
