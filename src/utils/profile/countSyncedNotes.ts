import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";

const hasThesisContent = (thesis: StockThesisContent): boolean =>
  Boolean(thesis.whyIOwnIt.trim() || thesis.whatToWatch.trim() || thesis.sellIf.trim());

export const countSyncedNotes = (
  thesisBySymbol: Record<string, StockThesisContent>,
  generalNotesBySymbol: Record<string, StockGeneralNote[]>,
): number => {
  const symbols = new Set<string>();

  for (const [symbol, thesis] of Object.entries(thesisBySymbol)) {
    if (hasThesisContent(thesis)) {
      symbols.add(symbol);
    }
  }

  for (const [symbol, notes] of Object.entries(generalNotesBySymbol)) {
    if (notes.length > 0) {
      symbols.add(symbol);
    }
  }

  return symbols.size;
};
