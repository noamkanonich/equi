"use client";

import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { CircularScore } from "@/components/ui/CircularScore";
import type { PortfolioHealthSummary } from "@/data/next-moves/next-moves.types";
import { getScoreTierColor } from "@/utils/scoring/getScoreTierColors";

type PortfolioHealthCardProps = {
  summary: PortfolioHealthSummary;
};

export const PortfolioHealthCard = ({ summary }: PortfolioHealthCardProps) => {
  const t = useTranslations("nextMoves");
  const theme = useTheme();

  return (
    <Card>
      <Title>{t("cards.portfolioHealth.title")}</Title>
      <HealthContent>
        <CircularScore
          score={summary.score}
          size="lg"
          ariaLabel={t("accessibility.portfolioScore", {
            score: summary.score,
            max: summary.maxScore,
          })}
        />
        <Legend>
          {summary.legend.map((item) => (
            <LegendRow key={item.key}>
              <LegendDot $color={getScoreTierColor(item.key, theme)} />
              <LegendLabel>{t(`cards.portfolioHealth.${item.key}`)}</LegendLabel>
              <LegendValue>{item.value}</LegendValue>
            </LegendRow>
          ))}
        </Legend>
      </HealthContent>
      <StatusTitle>{t(summary.titleKey)}</StatusTitle>
      <StatusCopy>{t(summary.subtitleKey)}</StatusCopy>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const HealthContent = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendDot = styled.span<{ $color: string }>`
  inline-size: 0.55rem;
  block-size: 0.55rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const LegendValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const StatusTitle = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const StatusCopy = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
