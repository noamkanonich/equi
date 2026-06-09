"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import type { DashboardChartSegment } from "@/data/dashboard/dashboard.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_EMPTY = false;

type AssetAllocationCardProps = {
  segments: DashboardChartSegment[];
  locale: string;
  dataState?: DataState;
};

export const AssetAllocationCard = ({
  segments,
  locale,
  dataState,
}: AssetAllocationCardProps) => {
  const t = useTranslations("dashboard");
  const tStates = useTranslations("states");
  const theme = useTheme();

  const colors = useMemo(
    () => [
      theme.colors.chart.blue,
      theme.colors.chart.green,
      theme.colors.chart.amber,
      theme.colors.chart.purple,
    ],
    [theme],
  );

  const getFill = useCallback(
    (index: number) => colors[index % colors.length],
    [colors],
  );

  const getTooltipRows = useCallback(
    (segment: DashboardChartSegment): ChartTooltipRow[] => [
      {
        label: t(`charts.labels.${segment.key}`),
        value: formatPercent(segment.value, {
          decimals: 0,
          locale,
          showSign: false,
        }),
        percent: t("charts.tooltip.percentLabel", {
          percent: formatPercent(segment.value, {
            decimals: 1,
            locale,
            showSign: false,
          }),
        }),
      },
    ],
    [locale, t],
  );

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: DEV_SIMULATE_EMPTY || segments.length === 0,
  });

  const renderContent = () => {
    if (effectiveState === "loading") {
      return <SkeletonChart $height="8rem" />;
    }

    if (effectiveState === "empty") {
      return (
        <EmptyState
          title={tStates("empty.title")}
          description={tStates("empty.description")}
          $compact
        />
      );
    }

    return (
      <>
        <ChartWrap>
          <AnimatedDonutChart
            data={segments}
            getFill={getFill}
            getTooltipRows={getTooltipRows}
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={3}
          />
        </ChartWrap>
        <Legend>
          {segments.map((segment, index) => (
            <LegendRow key={segment.key}>
              <LegendDot $color={colors[index % colors.length]} />
              <LegendLabel>{t(`charts.labels.${segment.key}`)}</LegendLabel>
              <LegendValue>
                {formatPercent(segment.value, {
                  decimals: 0,
                  locale,
                  showSign: false,
                })}
              </LegendValue>
            </LegendRow>
          ))}
        </Legend>
      </>
    );
  };

  return (
    <Card>
      <Title>{t("cards.assetAllocation")}</Title>
      <Content>{renderContent()}</Content>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  block-size: 100%;
  min-block-size: 13.25rem;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChartWrap = styled.div`
  inline-size: min(100%, 9rem);
  block-size: 8rem;
`;

const Legend = styled.div`
  inline-size: 100%;
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
  border-radius: 50%;
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
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
