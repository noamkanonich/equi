"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { CardTitle, PreviewCard } from "./appearancePreviewPrimitives";

type AppearancePreviewMetricsRowProps = {
  cardRadius: string;
  padding: "sm" | "md";
  isCompact: boolean;
};

const previewScore = 78;

export const AppearancePreviewMetricsRow = ({
  cardRadius,
  padding,
  isCompact,
}: AppearancePreviewMetricsRowProps) => {
  const t = useTranslations("settings.appearance.preview");

  return (
    <MiniGrid $compact={isCompact}>
      <PreviewCard $padding={padding} $radius={cardRadius}>
        <MetricHeader>
          <CardTitle>{t("score")}</CardTitle>
          <MetricSubtitle>{t("overallScore")}</MetricSubtitle>
        </MetricHeader>
        <ScoreGaugeWrap aria-label={`${previewScore} ${t("scoreLabel")}`}>
          <ScoreRing aria-hidden>
            <ScoreRingProgress $percent={previewScore} />
            <ScoreRingInner />
          </ScoreRing>
          <ScoreCenter>
            <ScoreNumber>{previewScore}</ScoreNumber>
            <ScoreCaption>{t("scoreLabel")}</ScoreCaption>
          </ScoreCenter>
        </ScoreGaugeWrap>
      </PreviewCard>

      <PreviewCard $padding={padding} $radius={cardRadius}>
        <MetricHeader>
          <CardTitle>{t("riskProfile")}</CardTitle>
          <MetricSubtitle>{t("moderate")}</MetricSubtitle>
        </MetricHeader>
        <RiskDots aria-hidden>
          {[1, 2, 3, 4, 5].map((dot) => (
            <RiskDot key={dot} $active={dot >= 2 && dot <= 4} />
          ))}
        </RiskDots>
      </PreviewCard>
    </MiniGrid>
  );
};

const MiniGrid = styled.div<{ $compact: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme, $compact }) =>
    $compact ? theme.spacing.sm : theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MetricHeader = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const MetricSubtitle = styled.span`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const ScoreGaugeWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 6.5rem;
`;

const ScoreRing = styled.div`
  position: relative;
  inline-size: 5.5rem;
  block-size: 5.5rem;
`;

const ScoreRingProgress = styled.div<{ $percent: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from -90deg,
    ${({ theme }) => theme.colors.brand.primary} 0deg
      ${({ $percent }) => ($percent / 100) * 360}deg,
    ${({ theme }) => theme.colors.background.soft}
      ${({ $percent }) => ($percent / 100) * 360}deg 360deg
  );
`;

const ScoreRingInner = styled.div`
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.card};
`;

const ScoreCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ScoreNumber = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
`;

const ScoreCaption = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const RiskDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-block-size: 6.5rem;
`;

const RiskDot = styled.span<{ $active: boolean }>`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.status.warning : theme.colors.border.subtle};
`;
