import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RecentSearchEntry } from "@/data/search/recent-search.types";

const MAX_RECENT_SEARCHES = 8;

type RecordRecentSearchInput = {
  symbol: string;
  companyName: string;
};

type RecentSearchState = {
  recentSearches: RecentSearchEntry[];
  recordRecentSearch: (input: RecordRecentSearchInput) => void;
  clearRecentSearches: () => void;
};

export const useRecentSearchStore = create<RecentSearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      recordRecentSearch: ({ symbol, companyName }) => {
        const normalizedSymbol = symbol.trim().toUpperCase();
        if (!normalizedSymbol) {
          return;
        }

        set((state) => {
          const nextEntry: RecentSearchEntry = {
            symbol: normalizedSymbol,
            companyName: companyName.trim() || normalizedSymbol,
            searchedAt: new Date().toISOString(),
          };

          const withoutDuplicate = state.recentSearches.filter(
            (entry) => entry.symbol !== normalizedSymbol,
          );

          return {
            recentSearches: [nextEntry, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES),
          };
        });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "equi-recent-searches",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    },
  ),
);
