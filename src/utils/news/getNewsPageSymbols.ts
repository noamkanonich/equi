const MAX_NEWS_SYMBOLS = 8;

export const getNewsPageSymbols = (
  portfolioSymbols: string[],
  watchlistSymbols: string[],
): string[] => {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const symbol of portfolioSymbols) {
    const normalized = symbol.trim().toUpperCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    ordered.push(normalized);
    if (ordered.length >= MAX_NEWS_SYMBOLS) {
      return ordered;
    }
  }

  for (const symbol of watchlistSymbols) {
    const normalized = symbol.trim().toUpperCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    ordered.push(normalized);
    if (ordered.length >= MAX_NEWS_SYMBOLS) {
      break;
    }
  }

  return ordered;
};
