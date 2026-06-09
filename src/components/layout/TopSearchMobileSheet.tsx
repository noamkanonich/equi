"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SearchInput } from "@/components/ui/SearchInput";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { RecentSearchDisplayEntry } from "@/data/search/recent-search.types";
import { TopSearchPanelContent } from "./TopSearchPanelContent";

type TopSearchMobileSheetProps = {
  isOpen: boolean;
  query: string;
  results: AddStockSearchResult[];
  suggestions: AddStockSearchResult[];
  recentSearches: RecentSearchDisplayEntry[];
  isLoading: boolean;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (stock: AddStockSearchResult) => void;
  onSelectRecent: (entry: RecentSearchDisplayEntry) => void;
  onClearRecent: () => void;
};

export const TopSearchMobileSheet = ({
  isOpen,
  query,
  results,
  suggestions,
  recentSearches,
  isLoading,
  onClose,
  onQueryChange,
  onSearchKeyDown,
  onSelect,
  onSelectRecent,
  onClearRecent,
}: TopSearchMobileSheetProps) => {
  const tStockSearch = useTranslations("stockSearch");
  const tTop = useTranslations("topSearch");

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={tTop("sheetTitle")}
      closeLabel={tTop("closeSheet")}
    >
      <SheetBody>
        <SearchInput
          label={tStockSearch("searchPlaceholder")}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder={tStockSearch("searchPlaceholder")}
          autoComplete="off"
          autoFocus
        />
        <ScrollArea>
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
        </ScrollArea>
      </SheetBody>
    </BottomSheet>
  );
};

const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-block-size: 0;
`;

const ScrollArea = styled.div`
  max-block-size: min(24rem, 55vh);
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
`;
