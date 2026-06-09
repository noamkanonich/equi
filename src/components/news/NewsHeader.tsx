"use client";

import { Newspaper, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { DataFreshnessBadge } from "@/components/ui/states/DataFreshnessBadge";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";

type NewsHeaderProps = {
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  freshnessStatus: DataFreshnessStatus;
};

export const NewsHeader = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing = false,
  freshnessStatus,
}: NewsHeaderProps) => {
  const t = useTranslations("news");

  return (
    <Header>
      <TitleGroup>
        <IconWrap aria-hidden>
          <Newspaper size={20} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <TitleRow>
            <Title>{title}</Title>
            {freshnessStatus !== "live" ? (
              <DataFreshnessBadge status={freshnessStatus} />
            ) : null}
          </TitleRow>
          <Subtitle>{subtitle}</Subtitle>
        </Copy>
      </TitleGroup>
      <Actions>
        <SearchWrap>
          <SearchInput
            label={t("searchPlaceholder")}
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </SearchWrap>
        <Button
          $variant="secondary"
          $size="sm"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label={t("refresh")}
        >
          <RefreshCw size={14} strokeWidth={1.9} aria-hidden />
          {t("refresh")}
        </Button>
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
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  inline-size: 2.5rem;
  block-size: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
  flex-shrink: 0;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrap = styled.div`
  min-inline-size: 14rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
    min-inline-size: 0;
  }
`;
