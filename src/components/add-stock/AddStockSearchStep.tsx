"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/states/ErrorState";
import { LoadingState } from "@/components/ui/states/LoadingState";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SearchInput } from "@/components/ui/SearchInput";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import { AddStockPopularSearches } from "./AddStockPopularSearches";
import { AddStockResultsList } from "./AddStockResultsList";

type AddStockSearchStepProps = {
  query: string;
  popularSymbols: string[];
  results: AddStockSearchResult[];
  selectedSymbol: string | null;
  isSearching?: boolean;
  hasSearchError?: boolean;
  isFallback?: boolean;
  onQueryChange: (query: string) => void;
  onPopularSelect: (symbol: string) => void;
  onSelectStock: (stock: AddStockSearchResult) => void;
  onRetrySearch?: () => void;
};

export const AddStockSearchStep = ({
  query,
  popularSymbols,
  results,
  selectedSymbol,
  isSearching = false,
  hasSearchError = false,
  isFallback = false,
  onQueryChange,
  onPopularSelect,
  onSelectStock,
  onRetrySearch,
}: AddStockSearchStepProps) => {
  const t = useTranslations("addStock");
  const tStockSearch = useTranslations("stockSearch");
  const tStates = useTranslations("states");
  const hasQuery = query.trim().length > 0;
  const showMinQueryHint = query.trim().length > 0 && query.trim().length < 2;

  const renderResults = () => {
    if (hasSearchError) {
      return (
        <ErrorState
          title={tStates("error.title")}
          description={tStates("error.description")}
          retryAction={
            onRetrySearch
              ? {
                  label: tStates("error.retry"),
                  onClick: onRetrySearch,
                }
              : undefined
          }
        />
      );
    }

    if (isSearching) {
      return <LoadingState variant="inline" title={tStockSearch("loading")} />;
    }

    if (showMinQueryHint) {
      return (
        <EmptyState
          title={tStockSearch("minQuery")}
          description={t("search.helper")}
        />
      );
    }

    if (results.length > 0) {
      return (
        <AddStockResultsList
          results={results}
          selectedSymbol={selectedSymbol}
          onSelect={onSelectStock}
        />
      );
    }

    if (hasQuery) {
      return (
        <NoResultsState
          title={t("search.noResultsTitle")}
          description={t("search.noResultsDescription")}
          clearAction={{
            label: tStates("noResults.clearSearch"),
            onClick: () => onQueryChange(""),
            variant: "secondary",
          }}
        />
      );
    }

    return (
      <EmptyState
        title={t("search.title")}
        description={t("search.helper")}
      />
    );
  };

  return (
    <Wrapper>
      <SearchCard>
        <StepKicker>{t("search.stepLabel")}</StepKicker>
        <Title>{t("search.title")}</Title>
        <Helper>{t("search.helper")}</Helper>
        <SearchInput
          label={t("actions.search")}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t("search.placeholder")}
          autoComplete="off"
        />
        <AddStockPopularSearches symbols={popularSymbols} onSelect={onPopularSelect} />
      </SearchCard>

      <ResultsCard>
        <ResultsHeader>
          <div>
            <ResultsTitle>
              {hasQuery ? t("search.results") : t("search.trendingResults")}
            </ResultsTitle>
            <ResultsCount>{t("search.resultsFound", { count: results.length })}</ResultsCount>
          </div>
        </ResultsHeader>
        {isFallback ? (
          <FallbackNotice>{tStockSearch("mockNotice")}</FallbackNotice>
        ) : null}

        {renderResults()}
      </ResultsCard>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
  min-block-size: 0;
`;

const SearchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const StepKicker = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: start;
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  text-align: start;
`;

const Helper = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const ResultsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-block-size: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ResultsHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ResultsTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  text-align: start;
`;

const ResultsCount = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const FallbackNotice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;
