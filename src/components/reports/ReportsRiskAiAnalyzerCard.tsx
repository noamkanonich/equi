"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SkeletonCard } from "@/components/ui/states/SkeletonCard";
import type { ReportsRiskAiInsight } from "@/data/reports/reports.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

const DEV_SIMULATE_LOADING = false;

type ReportsRiskAiAnalyzerCardProps = {
  insight: ReportsRiskAiInsight;
  locale: string;
  dataState?: DataState;
};

export const ReportsRiskAiAnalyzerCard = ({
  insight,
  locale,
  dataState,
}: ReportsRiskAiAnalyzerCardProps) => {
  const t = useTranslations("reports.risk.aiAnalyzer");

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: false,
  });

  if (effectiveState === "loading") {
    return (
      <Card>
        <SkeletonCard $bodyLines={6} />
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
        <Title>{t("title")}</Title>
      </Header>

      <Summary>{t(insight.summaryKey)}</Summary>

      <InsightList>
        <InsightRow>
          <Label>{t("primaryRisk")}</Label>
          <Copy>{t(insight.primaryRiskKey)}</Copy>
        </InsightRow>
        <InsightRow>
          <Label>{t("concentrationRisk")}</Label>
          <Copy>{t(insight.concentrationRiskKey)}</Copy>
        </InsightRow>
        <InsightRow>
          <Label>{t("monitoringSuggestion")}</Label>
          <Copy>{t(insight.monitoringSuggestionKey)}</Copy>
        </InsightRow>
      </InsightList>

      <RiskFactors>
        <RiskFactorsTitle>{t("riskFactorsTitle")}</RiskFactorsTitle>
        <RiskFactorList>
          {insight.riskFactorKeys.map((factorKey) => (
            <RiskFactorItem key={factorKey}>{t(factorKey)}</RiskFactorItem>
          ))}
        </RiskFactorList>
      </RiskFactors>

      <Confidence>
        <ConfidenceCopy>
          <span>{t("confidence")}</span>
          <ConfidenceValue dir="ltr">{formattedConfidence}</ConfidenceValue>
        </ConfidenceCopy>
        <ConfidenceTrack aria-hidden>
          <ConfidenceFill $value={confidencePercent} />
        </ConfidenceTrack>
      </Confidence>

      <Disclaimer>{t("disclaimer")}</Disclaimer>
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
  margin-block-end: ${({ theme }) => theme.spacing.md};
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

const RiskFactors = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const RiskFactorsTitle = styled.h3`
  margin-block-end: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const RiskFactorList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding-inline-start: ${({ theme }) => theme.spacing.md};
`;

const RiskFactorItem = styled.li`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Confidence = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.soft};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
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
