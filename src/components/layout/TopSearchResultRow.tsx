"use client";

import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { MockDataBadge } from "@/components/ui/MockDataBadge";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { RecentSearchDisplayEntry } from "@/data/search/recent-search.types";

type TopSearchResultRowProps = {
  stock: AddStockSearchResult | RecentSearchDisplayEntry;
  variant?: "default" | "recent";
  onSelect: () => void;
};

export const TopSearchResultRow = ({
  stock,
  variant = "default",
  onSelect,
}: TopSearchResultRowProps) => {
  const tTop = useTranslations("topSearch");
  const displaySymbol = "displaySymbol" in stock ? stock.displaySymbol : stock.symbol;
  const isMock = "isMock" in stock ? stock.isMock : false;

  return (
    <ResultButton type="button" role="option" onClick={onSelect}>
      {variant === "recent" ? (
        <HistoryIcon size={16} strokeWidth={1.75} aria-hidden />
      ) : null}
      <ResultMain>
        <Symbol dir="ltr">{displaySymbol}</Symbol>
        <CompanyName>{stock.companyName}</CompanyName>
      </ResultMain>
      {isMock ? <MockDataBadge /> : null}
      <ActionHint>{tTop("viewStock")}</ActionHint>
    </ResultButton>
  );
};

const ResultButton = styled.button`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: transparent;
  text-align: start;
  cursor: pointer;

  &:last-child {
    border-block-end: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: -2px;
  }
`;

const HistoryIcon = styled(History)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ResultMain = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-inline-size: 0;
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const CompanyName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionHint = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;
