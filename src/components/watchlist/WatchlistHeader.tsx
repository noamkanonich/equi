"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";

type WatchlistHeaderProps = {
  title: string;
  subtitle: string;
  onAddStockClick: () => void;
  onFilterClick: () => void;
  activeFilterCount: number;
};

export const WatchlistHeader = ({
  title,
  subtitle,
  onAddStockClick,
  onFilterClick,
  activeFilterCount,
}: WatchlistHeaderProps) => {
  const t = useTranslations("watchlist");

  return (
    <Header>
      <Copy>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Copy>
      <Actions>
        <Button $variant="primary" onClick={onAddStockClick}>
          <Plus size={16} strokeWidth={1.9} aria-hidden />
          {t("actions.addStock")}
        </Button>
        <FilterButton
          type="button"
          onClick={onFilterClick}
          aria-label={t("filters.open")}
        >
          <SlidersHorizontal size={16} strokeWidth={1.9} aria-hidden />
          {t("actions.filter")}
          {activeFilterCount > 0 ? (
            <FilterCount aria-label={t("filters.activeCount", { count: activeFilterCount })}>
              {activeFilterCount}
            </FilterCount>
          ) : null}
        </FilterButton>
      </Actions>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-block-start: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  max-inline-size: 42rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
    justify-content: flex-start;

    > * {
      flex: 1 1 10rem;
    }
  }
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.card};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.strong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const FilterCount = styled.span`
  min-inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  background: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
