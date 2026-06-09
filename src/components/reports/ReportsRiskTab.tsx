"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import type { RiskMetricItem, ReportsPageData } from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";
import { ReportsRiskAiAnalyzerCard } from "./ReportsRiskAiAnalyzerCard";

type ReportsRiskTabProps = {
  pageData: ReportsPageData;
  locale: string;
  dataState?: DataState;
};

type ToneProps = { $tone: "positive" | "negative" | "neutral" };

export const ReportsRiskTab = ({ pageData, locale, dataState }: ReportsRiskTabProps) => {
  const t = useTranslations("reports.risk");

  return (
    <TabStack>
      <MetricsCard $padding="lg">
        <CardTitle>{t("title")}</CardTitle>
        <MetricsGrid>
          {pageData.riskMetrics.map((item: RiskMetricItem) => (
            <MetricItem key={item.key}>
              <MetricLabel>{t(`metrics.${item.key}`)}</MetricLabel>
              <MetricValue $tone={item.tone ?? "neutral"}>{item.value}</MetricValue>
            </MetricItem>
          ))}
        </MetricsGrid>
      </MetricsCard>

      <ReportsRiskAiAnalyzerCard
        insight={pageData.riskAiInsight}
        locale={locale}
        dataState={dataState}
      />

      <DisclaimerCard $padding="lg">
        <DisclaimerTitle>{t("disclaimer.title")}</DisclaimerTitle>
        <DisclaimerText>{t("disclaimer.body")}</DisclaimerText>
      </DisclaimerCard>
    </TabStack>
  );
};

const TabStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetricsCard = styled(Card)``;

const CardTitle = styled.h2`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const MetricsGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const MetricLabel = styled.dt`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const MetricValue = styled.dd<ToneProps>`
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "negative"
        ? theme.colors.status.negative
        : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const DisclaimerCard = styled(Card)``;

const DisclaimerTitle = styled.h3`
  margin-block-end: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const DisclaimerText = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
