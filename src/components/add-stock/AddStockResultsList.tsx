"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import { AddStockResultRow } from "./AddStockResultRow";

const getAddStockAssetKey = (stock: AddStockSearchResult): string =>
  stock.assetId ?? `US:${stock.symbol}`;

type AddStockResultsListProps = {
  results: AddStockSearchResult[];
  selectedSymbol: string | null;
  onSelect: (stock: AddStockSearchResult) => void;
};

export const AddStockResultsList = ({
  results,
  selectedSymbol,
  onSelect,
}: AddStockResultsListProps) => {
  const t = useTranslations("addStock");

  return (
    <Wrapper>
      <TableHeader aria-hidden>
        <HeaderSpacer />
        <span>{t("table.symbol")}</span>
        <span>{t("table.exchange")}</span>
        <HeaderEnd>{t("table.price")}</HeaderEnd>
        <HeaderEnd>{t("table.dayChange")}</HeaderEnd>
        <HeaderEnd>{t("table.score")}</HeaderEnd>
      </TableHeader>
      <Rows>
        {results.map((stock, index) => (
          <AddStockResultRow
            key={getAddStockAssetKey(stock)}
            stock={stock}
            selected={getAddStockAssetKey(stock) === selectedSymbol}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </Rows>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-block-size: 0;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns:
    auto minmax(8rem, 1.35fr) minmax(6rem, 0.8fr) minmax(5.5rem, auto)
    minmax(6.875rem, 0.55fr) 2rem;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-inline: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const HeaderSpacer = styled.span`
  inline-size: 1.25rem;
`;

const HeaderEnd = styled.span`
  text-align: end;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;
