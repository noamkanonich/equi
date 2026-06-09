import type { Stock } from "@/types/stock";
import { companyProfileLogoUrls } from "@/data/stocks/company-profile-logos.mock";

/** Legacy store shape — distinct from WatchlistItem in watchlist.types.ts */
export type LegacyWatchlistStock = Stock & {
  addedAt: string;
  notes?: string;
};

export const mockWatchlist: LegacyWatchlistStock[] = [
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    logoUrl: companyProfileLogoUrls.GOOGL,
    price: 175.3,
    changePercent: 0.6,
    sector: "Technology",
    addedAt: "2025-01-15",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    logoUrl: companyProfileLogoUrls.AMZN,
    price: 198.4,
    changePercent: -1.1,
    sector: "Consumer Cyclical",
    addedAt: "2025-02-01",
  },
];
