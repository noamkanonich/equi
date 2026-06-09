"use client";

import styled from "styled-components";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { RecentSearchDisplayEntry } from "@/data/search/recent-search.types";
import { TopSearchPanelContent } from "./TopSearchPanelContent";

type TopSearchResultsPanelProps = {
  results: AddStockSearchResult[];
  suggestions: AddStockSearchResult[];
  recentSearches: RecentSearchDisplayEntry[];
  isLoading: boolean;
  query: string;
  onSelect: (stock: AddStockSearchResult) => void;
  onSelectRecent: (entry: RecentSearchDisplayEntry) => void;
  onClearRecent: () => void;
};

export const TopSearchResultsPanel = ({
  results,
  suggestions,
  recentSearches,
  isLoading,
  query,
  onSelect,
  onSelectRecent,
  onClearRecent,
}: TopSearchResultsPanelProps) => {
  return (
    <Panel>
      <TopSearchPanelContent
        query={query}
        results={results}
        suggestions={suggestions}
        recentSearches={recentSearches}
        isLoading={isLoading}
        onSelect={onSelect}
        onSelectRecent={onSelectRecent}
        onClearRecent={onClearRecent}
      />
    </Panel>
  );
};

const Panel = styled.div`
  position: absolute;
  inset-block-start: calc(100% + ${({ theme }) => theme.spacing.xs});
  inset-inline: 0;
  z-index: 30;
  max-block-size: min(24rem, 50vh);
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;
