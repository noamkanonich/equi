import { mockStocks } from "@/data/mockStocks";
import type { FinancialDataProvider } from "./financial-data.types";
import type { Stock } from "@/types/stock";

export const financialDataProvider: FinancialDataProvider = {
  async getStock(symbol: string): Promise<Stock | null> {
    return mockStocks.find((s) => s.symbol === symbol) ?? null;
  },

  async searchStocks(query: string): Promise<Stock[]> {
    const q = query.toLowerCase();
    return mockStocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q),
    );
  },

  async getQuote(symbol: string) {
    const stock = await this.getStock(symbol);
    if (!stock) return null;
    return { price: stock.price, changePercent: stock.changePercent };
  },
};
