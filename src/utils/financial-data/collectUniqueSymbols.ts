import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import { logAppDataSymbolTruncation } from "@/utils/app-data/devAppDataLog";
import { STOCK_BUNDLES_MAX_SYMBOLS } from "@/utils/financial-data/stock-bundle.schema";

export const collectUniqueSymbols = (
  symbols: Array<string | undefined | null>,
  maxSymbols: number = STOCK_BUNDLES_MAX_SYMBOLS,
): string[] => {
  const seen = new Set<string>();
  const collected: string[] = [];

  for (const symbol of symbols) {
    if (!symbol?.trim()) {
      continue;
    }

    const normalized = normalizeProviderSymbol(symbol);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    collected.push(normalized);
  }

  if (collected.length > maxSymbols) {
    logAppDataSymbolTruncation({
      requestedCount: collected.length,
      maxSymbols,
    });
    return collected.slice(0, maxSymbols);
  }

  return collected;
};
