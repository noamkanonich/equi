import type {
  NextMoveItem,
  NextMovesTab,
  NextMoveType,
} from "./next-moves.types";

export const nextMoveTabs: NextMovesTab[] = [
  "allActions",
  "needsAction",
  "opportunities",
  "risks",
  "earnings",
  "dismissed",
];

const tabTypeMap: Partial<Record<NextMovesTab, NextMoveType>> = {
  needsAction: "needsAction",
  opportunities: "opportunity",
  risks: "risk",
  earnings: "earnings",
};

export const getNextMoveTabCount = (
  moves: NextMoveItem[],
  tab: NextMovesTab,
): number => {
  if (tab === "allActions") {
    return moves.filter((move) => move.status === "active").length;
  }

  if (tab === "dismissed") {
    return moves.filter((move) => move.status === "dismissed").length;
  }

  const type = tabTypeMap[tab];
  return moves.filter((move) => move.status === "active" && move.type === type).length;
};

export const getNextMoveTabCounts = (moves: NextMoveItem[]) =>
  nextMoveTabs.reduce<Record<NextMovesTab, number>>(
    (counts, tab) => ({
      ...counts,
      [tab]: getNextMoveTabCount(moves, tab),
    }),
    {
      allActions: 0,
      needsAction: 0,
      opportunities: 0,
      risks: 0,
      earnings: 0,
      dismissed: 0,
    },
  );
