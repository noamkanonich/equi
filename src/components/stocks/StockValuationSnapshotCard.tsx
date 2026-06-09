"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled, { type DefaultTheme } from "styled-components";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import type { ValuationMetricStatus, ValuationSnapshotMetric } from "@/data/stocks/stock-analysis.types";

type StockValuationSnapshotCardProps = {
  metrics: ValuationSnapshotMetric[];
};

export const StockValuationSnapshotCard = ({ metrics }: StockValuationSnapshotCardProps) => {
  const t = useTranslations("stockAnalysis");
  const tInteractions = useTranslations("interactions");
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
    <Card>
      <CardTitle>{t("fundamentals.valuation.title")}</CardTitle>
      <MetricList>
        {metrics.map((metric) => (
          <MetricRow key={metric.labelKey}>
            <MetricLabel>{t(metric.labelKey)}</MetricLabel>
            <MetricRight>
              <MetricValue>{metric.value}</MetricValue>
              <StatusBadge $status={metric.status}>
                {t(`fundamentals.valuation.${metric.status}`)}
              </StatusBadge>
            </MetricRight>
          </MetricRow>
        ))}
      </MetricList>
      <CardFooter>
        <ViewMoreButton type="button" onClick={() => setIsMoreOpen(true)}>
          {t("fundamentals.valuation.viewMoreMetrics")}
        </ViewMoreButton>
      </CardFooter>
    </Card>

    <PlaceholderModal
      isOpen={isMoreOpen}
      onClose={() => setIsMoreOpen(false)}
      title={tInteractions("features.viewMoreMetricsTitle")}
      description={tInteractions("features.viewMoreMetricsDescription")}
    />
    </>
  );
};

const Card = styled.section`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const CardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const MetricList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MetricRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: 0;
  }
`;

const MetricLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const MetricRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const MetricValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const statusColor = ({ $status, theme }: { $status: ValuationMetricStatus; theme: DefaultTheme }) => {
  if ($status === "high") return theme.colors.status.warning;
  if ($status === "moderate") return theme.colors.status.neutral;
  if ($status === "strong") return theme.colors.status.positive;
  return theme.colors.brand.primary;
};

const statusBg = ({ $status, theme }: { $status: ValuationMetricStatus; theme: DefaultTheme }) => {
  if ($status === "high") return theme.colors.status.warningSoft;
  if ($status === "moderate") return theme.colors.status.neutralSoft;
  if ($status === "strong") return theme.colors.status.positiveSoft;
  return theme.colors.brand.primarySoft;
};

const StatusBadge = styled.span<{ $status: ValuationMetricStatus }>`
  padding: 0.125rem ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  white-space: nowrap;
  color: ${statusColor};
  background: ${statusBg};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  padding-block-start: ${({ theme }) => theme.spacing.md};
`;

const ViewMoreButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
