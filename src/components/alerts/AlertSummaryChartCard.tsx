"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import type { AlertSummaryBreakdown } from "@/data/alerts/alerts.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type AlertSummaryChartCardProps = {
  breakdown: AlertSummaryBreakdown[];
  locale: string;
};

export const AlertSummaryChartCard = ({
  breakdown,
  locale,
}: AlertSummaryChartCardProps) => {
  const t = useTranslations("alerts");
  const theme = useTheme();

  const chartData = useMemo(
    () =>
      breakdown.map((segment) => ({
        key: segment.key,
        value: segment.value,
        percent: segment.percent,
      })),
    [breakdown],
  );

  const colors = useMemo(
    () => [
      theme.colors.chart.blue,
      theme.colors.chart.amber,
      theme.colors.chart.green,
      theme.colors.chart.purple,
    ],
    [theme],
  );

  const getFill = useCallback(
    (index: number) => colors[index % colors.length],
    [colors],
  );

  const getTooltipRows = useCallback(
    (segment: (typeof chartData)[number]): ChartTooltipRow[] => [
      {
        label: t(`sidebar.breakdown.${segment.key}`),
        value: `${segment.value} (${formatPercent(segment.percent, { decimals: 0, locale, showSign: false })})`,
      },
    ],
    [locale, t],
  );

  return (
    <Card>
      <Title>{t("sidebar.summaryTitle")}</Title>
      <Content>
        <ChartWrap>
          <AnimatedDonutChart
            data={chartData}
            getFill={getFill}
            getTooltipRows={getTooltipRows}
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={3}
            cornerRadius={4}
          />
        </ChartWrap>
        <Legend>
          {breakdown.map((segment, index) => (
            <LegendRow key={segment.key}>
              <LegendDot $color={colors[index % colors.length]} />
              <LegendLabel>{t(`sidebar.breakdown.${segment.key}`)}</LegendLabel>
              <LegendMeta dir="ltr">
                {segment.value}{" "}
                <LegendPercent>
                  ({formatPercent(segment.percent, { decimals: 0, locale, showSign: false })})
                </LegendPercent>
              </LegendMeta>
            </LegendRow>
          ))}
        </Legend>
      </Content>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartWrap = styled.div`
  block-size: 11rem;
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
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LegendMeta = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;

const LegendPercent = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;
