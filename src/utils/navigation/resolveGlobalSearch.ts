import { popularAddStockSymbols } from "@/data/add-stock/add-stock.mock";

export type GlobalSearchResult =
  | { kind: "route"; href: string; labelKey: string }
  | { kind: "none" };

const routeKeywords: { keywords: string[]; href: string; labelKey: string }[] = [
  { keywords: ["portfolio", "holdings", "allocation"], href: "/portfolio", labelKey: "portfolio" },
  { keywords: ["watchlist", "watch"], href: "/watchlist", labelKey: "watchlist" },
  { keywords: ["alert", "alerts"], href: "/alerts", labelKey: "alerts" },
  { keywords: ["setting", "settings"], href: "/settings", labelKey: "settings" },
  { keywords: ["dashboard", "home"], href: "/", labelKey: "dashboard" },
  {
    keywords: ["smart replace", "smartreplace", "replace"],
    href: "/smart-replace",
    labelKey: "smartReplace",
  },
  { keywords: ["next moves", "nextmoves", "moves"], href: "/next-moves", labelKey: "nextMoves" },
];

const knownSymbols = new Set(
  popularAddStockSymbols.map((symbol) => symbol.toUpperCase()),
);

export const resolveGlobalSearch = (rawQuery: string): GlobalSearchResult => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return { kind: "none" };
  }

  const symbolCandidate = query.toUpperCase();
  if (knownSymbols.has(symbolCandidate)) {
    return {
      kind: "route",
      href: `/stocks/${symbolCandidate}`,
      labelKey: "stock",
    };
  }

  const routeMatch = routeKeywords.find(({ keywords }) =>
    keywords.some((keyword) => query.includes(keyword)),
  );

  if (routeMatch) {
    return {
      kind: "route",
      href: routeMatch.href,
      labelKey: routeMatch.labelKey,
    };
  }

  return { kind: "none" };
};
