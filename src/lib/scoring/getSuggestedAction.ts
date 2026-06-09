import type { SuggestedAction } from "@/data/scoring/scoring.types";
import { calculateStockScore } from "./calculateStockScore";

export const getSuggestedActionBySymbol = (symbol: string): SuggestedAction =>
  calculateStockScore(symbol).suggestedAction;
