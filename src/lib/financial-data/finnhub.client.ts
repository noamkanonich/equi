import type { Stock } from "@/types/stock";

export async function fetchFinnhubStock(_symbol: string): Promise<Stock | null> {
  // Placeholder — Finnhub API integration coming later
  return null;
}

export async function fetchFinnhubQuotes(_symbols: string[]): Promise<Stock[]> {
  return [];
}
