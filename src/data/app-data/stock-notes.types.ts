import type { StockNoteFormState } from "@/data/stocks/stock-note.types";

export type StockGeneralNote = StockNoteFormState & {
  id: string;
  createdAt: string;
};
