"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { RecentSearchDisplayEntry } from "@/data/search/recent-search.types";
import { TopSearchResultRow } from "./TopSearchResultRow";

type TopSearchPanelContentProps = {
  query: string;
  results: AddStockSearchResult[];
  suggestions: AddStockSearchResult[];
  recentSearches: RecentSearchDisplayEntry[];
  isLoading: boolean;
  onSelect: (stock: AddStockSearchResult) => void;
  onSelectRecent: (entry: RecentSearchDisplayEntry) => void;
  onClearRecent?: () => void;
};

export const TopSearchPanelContent = ({
  query,
  results,
  suggestions,
  recentSearches,
  isLoading,
  onSelect,
  onSelectRecent,
  onClearRecent,
}: TopSearchPanelContentProps) => {
  const t = useTranslations("stockSearch");
  const tTop = useTranslations("topSearch");
  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    return (
      <Content id="top-search-results" role="listbox" aria-label={t("searchPlaceholder")}>
        {recentSearches.length > 0 ? (
          <Section>
            <SectionHeader>
              <SectionTitle>{tTop("recentSearches")}</SectionTitle>
              {onClearRecent ? (
                <ClearButton type="button" onClick={onClearRecent}>
                  {tTop("clearRecent")}
                </ClearButton>
              ) : null}
            </SectionHeader>
            {recentSearches.map((entry) => (
              <TopSearchResultRow
                key={entry.symbol}
                stock={entry}
                variant="recent"
                onSelect={() => onSelectRecent(entry)}
              />
            ))}
          </Section>
        ) : null}

        <Section>
          <SectionHeader>
            <SectionTitle>{tTop("suggestions")}</SectionTitle>
          </SectionHeader>
          {suggestions.map((stock) => (
            <TopSearchResultRow
              key={stock.assetId ?? stock.symbol}
              stock={stock}
              onSelect={() => onSelect(stock)}
            />
          ))}
        </Section>
      </Content>
    );
  }

  if (trimmedQuery.length < 2) {
    return (
      <Content id="top-search-results" role="listbox" aria-label={t("searchPlaceholder")}>
        <Hint>{t("minQuery")}</Hint>
      </Content>
    );
  }

  if (isLoading) {
    return (
      <Content id="top-search-results" role="listbox" aria-label={t("searchPlaceholder")}>
        <Hint>{t("loading")}</Hint>
      </Content>
    );
  }

  if (results.length === 0) {
    return (
      <Content id="top-search-results" role="listbox" aria-label={t("searchPlaceholder")}>
        <EmptyTitle>{t("noResultsTitle")}</EmptyTitle>
        <Hint>{t("noResultsDescription")}</Hint>
      </Content>
    );
  }

  return (
    <Content id="top-search-results" role="listbox" aria-label={t("searchPlaceholder")}>
      {results.map((stock) => (
        <TopSearchResultRow
          key={stock.assetId ?? stock.symbol}
          stock={stock}
          onSelect={() => onSelect(stock)}
        />
      ))}
    </Content>
  );
};

const Content = styled.div`
  min-block-size: 0;
`;

const Section = styled.section`
  &:not(:last-child) {
    border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-block-end: ${({ theme }) => theme.spacing.xs};
`;

const SectionTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: start;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ClearButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  padding: 0;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const Hint = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  text-align: start;
`;

const EmptyTitle = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-align: start;
`;
