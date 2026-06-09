"use client";

import { ArrowUpRight, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { StockLogo } from "@/components/ui/StockLogo";
import type { WatchlistReplaceHolding } from "@/data/watchlist/watchlist.types";
import { Link } from "@/i18n/routing";

type WatchlistReplaceHoldingCardProps = {
  holding: WatchlistReplaceHolding;
};

export const WatchlistReplaceHoldingCard = ({
  holding,
}: WatchlistReplaceHoldingCardProps) => {
  const t = useTranslations("watchlist");

  return (
    <Card>
      <TitleRow>
        <RefreshCw size={16} strokeWidth={1.8} aria-hidden />
        <Title>{t("sidebar.couldReplaceHolding")}</Title>
      </TitleRow>
      <ContentRow>
        <StockLogo
          symbol={holding.candidateSymbol}
          companyName={holding.candidateSymbol}
          logoUrl={holding.candidateLogoUrl}
        />
        <Copy>
          <Headline dir="ltr">
            {t("replaceHolding.title", {
              candidate: holding.candidateSymbol,
              holding: holding.holdingSymbol,
            })}
          </Headline>
          <Summary>{t(holding.summaryKey)}</Summary>
        </Copy>
        <ArrowButton href="/smart-replace" aria-label={t("sidebar.couldReplaceHolding")}>
          <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden />
        </ArrowButton>
      </ContentRow>
    </Card>
  );
};

const Card = styled.article`
  block-size: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.chart.cyan};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const Copy = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Headline = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Summary = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ArrowButton = styled(Link)`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.background.card};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.strong};
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
