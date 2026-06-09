"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { WatchlistInsight } from "@/data/watchlist/watchlist.types";

type WatchlistAiInsightCardProps = {
  insight: WatchlistInsight;
};

export const WatchlistAiInsightCard = ({
  insight,
}: WatchlistAiInsightCardProps) => {
  const t = useTranslations("watchlist");

  return (
    <Card>
      <TitleRow>
        <IconWrap>
          <Sparkles size={16} strokeWidth={1.8} aria-hidden />
        </IconWrap>
        <Title>{t(insight.titleKey)}</Title>
      </TitleRow>
      <Body>{t(insight.bodyKey)}</Body>
      <Disclaimer>{t(insight.disclaimerKey)}</Disclaimer>
    </Card>
  );
};

const Card = styled.article`
  block-size: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-inline-start: 3px solid ${({ theme }) => theme.colors.brand.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Body = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Disclaimer = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
