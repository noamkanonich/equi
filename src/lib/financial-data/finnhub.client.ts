import type { Stock } from "@/types/stock";

export async function fetchFinnhubStock(symbol: string): Promise<Stock | null> {
  void symbol; // Placeholder — Finnhub API integration coming later
  return null;
}

export async function fetchFinnhubQuotes(symbols: string[]): Promise<Stock[]> {
  void symbols;
  return [];
}
