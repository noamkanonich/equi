"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { SkeletonCard } from "@/components/ui/states/SkeletonCard";
import type { DashboardAiInsight } from "@/data/dashboard/dashboard.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_EMPTY = false;

type AiPortfolioInsightCardProps = {
  insight?: DashboardAiInsight | null;
  locale: string;
  dataState?: DataState;
};

export const AiPortfolioInsightCard = ({
  insight,
  locale,
  dataState,
}: AiPortfolioInsightCardProps) => {
  const t = useTranslations("dashboard");

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: DEV_SIMULATE_EMPTY || !insight,
  });

  if (effectiveState === "loading") {
    return (
      <Card>
        <SkeletonCard $bodyLines={5} />
      </Card>
    );
  }

  if (effectiveState === "empty" || !insight) {
    return (
      <Card>
        <EmptyState
          title={t("ai.emptyPortfolio.title")}
          description={t("ai.emptyPortfolio.description")}
          $compact
        />
      </Card>
    );
  }

  const confidencePercent = Math.min(Math.max(insight.confidencePercent, 0), 100);
  const formattedConfidence = formatPercent(confidencePercent, {
    decimals: 0,
    locale,
    showSign: false,
  });

  return (
    <Card>
      <Header>
        <IconWrap aria-hidden>
          <Sparkles size={18} strokeWidth={1.8} />
        </IconWrap>
        <Title>{t("cards.aiInsight")}</Title>
      </Header>
      <Summary>{t("ai.summary")}</Summary>
      <InsightList>
        <InsightRow>
          <Label>{t("ai.keyPositive")}</Label>
          <Copy>{t("ai.keyPositiveText")}</Copy>
        </InsightRow>
        <InsightRow>
          <Label>{t("ai.potentialConcern")}</Label>
          <Copy>{t("ai.potentialConcernText")}</Copy>
        </InsightRow>
        <InsightRow>
          <Label>{t("ai.suggestedReview")}</Label>
          <Copy>{t("ai.suggestedReviewText")}</Copy>
        </InsightRow>
      </InsightList>
      <Confidence>
        <ConfidenceCopy>
          <span>{t("ai.confidence")}</span>
          <ConfidenceValue dir="ltr">{formattedConfidence}</ConfidenceValue>
        </ConfidenceCopy>
        <ConfidenceTrack aria-hidden>
          <ConfidenceFill $value={confidencePercent} />
        </ConfidenceTrack>
      </Confidence>
      <Disclaimer>{t("ai.disclaimer")}</Disclaimer>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-inline-start: 0.25rem solid ${({ theme }) => theme.colors.brand.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
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

const Summary = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const InsightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InsightRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Copy = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Confidence = styled.div`
  margin-block: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.soft};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.background.card};
`;

const ConfidenceCopy = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const ConfidenceValue = styled.strong`
  color: ${({ theme }) => theme.colors.brand.primaryDark};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ConfidenceTrack = styled.div`
  overflow: hidden;
  block-size: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.background.card};
`;

const ConfidenceFill = styled.div<{ $value: number }>`
  inline-size: ${({ $value }) => $value}%;
  block-size: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.primary};
`;

const Disclaimer = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

