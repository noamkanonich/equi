import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";
import type {
  PortfolioCashBalance,
  PortfolioHolding,
} from "@/data/portfolio/portfolio.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";
import type { WatchlistStoredItem } from "@/data/watchlist/watchlist.types";

export type PersistedAppDataVersion = "1";

export type PersistedAppDataV1 = {
  version: PersistedAppDataVersion;
  portfolioHoldings: PortfolioHolding[];
  cashBalance: PortfolioCashBalance;
  watchlistItems: WatchlistStoredItem[];
  stockThesisBySymbol: Record<string, StockThesisContent>;
  stockGeneralNotesBySymbol: Record<string, StockGeneralNote[]>;
  userCreatedAlerts: UserCreatedAlert[];
};
