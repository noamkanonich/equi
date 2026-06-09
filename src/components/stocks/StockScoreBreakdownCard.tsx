"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { CircularScore } from "@/components/ui/CircularScore";
import type { StockScoreBreakdownItem } from "@/data/stocks/stock-analysis.types";

type StockScoreBreakdownCardProps = {
  item: StockScoreBreakdownItem;
};

export const StockScoreBreakdownCard = ({ item }: StockScoreBreakdownCardProps) => {
  const t = useTranslations("stockAnalysis");

  return (
    <Card>
      <Title>{t(`scores.${item.category}`)}</Title>
      <ScoreContent>
        <CircularScore score={item.score} size="sm" showBase={false} />
        <ScoreLabel>{t(`scoreLabels.${item.labelKey}`)}</ScoreLabel>
      </ScoreContent>
    </Card>
  );
};

const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  block-size: 100%;
`;

const Title = styled.h3`
  inline-size: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: center;
`;

const ScoreContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ScoreLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
