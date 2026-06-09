export type StockNoteCategory = "thesis" | "watch" | "risk" | "general";

export type StockNoteFormState = {
  title: string;
  note: string;
  category: StockNoteCategory;
};

export const defaultStockNoteFormState: StockNoteFormState = {
  title: "",
  note: "",
  category: "thesis",
};

export type StockThesisFormState = {
  whyIOwnIt: string;
  whatToWatch: string;
  sellIf: string;
};

export const defaultStockThesisFormState: StockThesisFormState = {
  whyIOwnIt: "",
  whatToWatch: "",
  sellIf: "",
};

export type StockNoteModalMode = "note" | "thesis" | "holding" | "watchlist";
