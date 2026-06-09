import type { PortfolioCashBalance, PortfolioHolding } from "@/data/portfolio/portfolio.types";
import type { WatchlistStoredItem } from "@/data/watchlist/watchlist.types";
import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import type { StockGeneralNote } from "@/data/app-data/stock-notes.types";
import type { StockThesisContent } from "@/data/stocks/stock-thesis.types";

export const emptyPortfolioHoldings: PortfolioHolding[] = [];

export const emptyCashBalance: PortfolioCashBalance = {
  amount: 0,
  currency: "USD",
};

export const emptyWatchlistItems: WatchlistStoredItem[] = [];

export const emptyUserAlerts: UserCreatedAlert[] = [];

export const emptyStockThesisBySymbol: Record<string, StockThesisContent> = {};

export const emptyStockGeneralNotesBySymbol: Record<string, StockGeneralNote[]> = {};
