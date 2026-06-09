"use client";

import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import type { StockKeyMetric } from "@/data/stocks/stock-analysis.types";
import { formatDate } from "@/utils/formatting/formatDate";
import { formatPercent } from "@/utils/formatting/formatPercent";

type StockKeyMetricsCardProps = {
  metrics: StockKeyMetric[];
  locale: string;
};

const formatMetricValue = (
  metric: StockKeyMetric,
  locale: string,
): ReactNode => {
  if (metric.format === "percent" && typeof metric.value === "number") {
    return formatPercent(metric.value, { locale, showSign: false });
  }

  if (metric.format === "money" && typeof metric.value === "number" && metric.currency) {
    return (
      <DisplayMoney amount={metric.value} currency={metric.currency} locale={locale} />
    );
  }

  if (metric.format === "date" && typeof metric.value === "string") {
    return formatDate(metric.value, { locale });
  }

  return String(metric.value);
};

export const StockKeyMetricsCard = ({
  metrics,
  locale,
}: StockKeyMetricsCardProps) => {
  const t = useTranslations("stockAnalysis");

  return (
    <Card>
      <Title>{t("keyMetrics.title")}</Title>
      <Grid>
        {metrics.map((metric) => (
          <MetricRow key={metric.kind}>
            <LabelRow>
              <Label>{t(`keyMetrics.${metric.kind}`)}</Label>
              <InfoIcon aria-hidden>
                <Info size={13} strokeWidth={1.8} />
              </InfoIcon>
            </LabelRow>
            <Value>{formatMetricValue(metric, locale)}</Value>
          </MetricRow>
        ))}
      </Grid>
      <ViewMore type="button">{t("keyMetrics.viewMore")}</ViewMore>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  block-size: 100%;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetricRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const InfoIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ViewMore = styled.button`
  margin-block-start: ${({ theme }) => theme.spacing.md};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  text-align: start;

  &:hover {
    text-decoration: underline;
  }
`;
