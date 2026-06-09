import type { Stock } from "@/types/stock";

export interface FinancialDataProvider {
  getStock(symbol: string): Promise<Stock | null>;
  searchStocks(query: string): Promise<Stock[]>;
  getQuote(symbol: string): Promise<{ price: number; changePercent: number } | null>;
}
