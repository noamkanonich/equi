"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";

type AddStockPopularSearchesProps = {
  symbols: string[];
  onSelect: (symbol: string) => void;
};

export const AddStockPopularSearches = ({
  symbols,
  onSelect,
}: AddStockPopularSearchesProps) => {
  const t = useTranslations("addStock");

  return (
    <Wrapper>
      <Label>{t("search.popularSearches")}</Label>
      <ChipRow>
        {symbols.map((symbol) => (
          <Chip
            key={symbol}
            type="button"
            onClick={() => onSelect(symbol)}
            aria-label={t("actions.searchSymbol", { symbol })}
            dir="ltr"
          >
            {symbol}
          </Chip>
        ))}
      </ChipRow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Chip = styled.button`
  min-block-size: 2.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  padding-inline: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primarySoft};
    border-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
