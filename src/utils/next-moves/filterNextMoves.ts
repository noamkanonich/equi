import type {
  NextMoveItem,
  NextMovesTab,
  NextMoveType,
} from "@/data/next-moves/next-moves.types";

const tabTypeMap: Partial<Record<NextMovesTab, NextMoveType>> = {
  needsAction: "needsAction",
  opportunities: "opportunity",
  risks: "risk",
  earnings: "earnings",
};

export const filterNextMoves = (
  moves: NextMoveItem[],
  activeTab: NextMovesTab,
): NextMoveItem[] => {
  if (activeTab === "allActions") {
    return moves.filter((move) => move.status === "active");
  }

  if (activeTab === "dismissed") {
    return moves.filter((move) => move.status === "dismissed");
  }

  const type = tabTypeMap[activeTab];
  return moves.filter((move) => move.status === "active" && move.type === type);
};
