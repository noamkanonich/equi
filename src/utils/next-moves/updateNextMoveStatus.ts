import type { NextMoveItem } from "@/data/next-moves/next-moves.types";

export const updateNextMoveStatus = (
  moves: NextMoveItem[],
  moveId: string,
  status: "active" | "dismissed",
): NextMoveItem[] =>
  moves.map((move) => (move.id === moveId ? { ...move, status } : move));
