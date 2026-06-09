"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import type { AllocationReportItem } from "@/data/reports/reports.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { PortfolioAllocationKey } from "@/data/portfolio/portfolio.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { CHART_ANIMATION_BEGIN } from "@/utils/charts/chartAnimation";
import { formatPercent } from "@/utils/formatting/formatPercent";

type AllocationReportCardProps = {
  segments: AllocationReportItem[];
  totalValue: number;
  currency: CurrencyCode;
  locale: string;
  dataState?: DataState;
};

export const AllocationReportCard = ({
  segments,
  totalValue,
  currency,
  locale,
  dataState,
}: AllocationReportCardProps) => {
  const t = useTranslations("reports.allocation");
  const tStates = useTranslations("states");
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const chartSegments = useMemo(
    () => segments.map((segment) => ({ key: segment.key, value: segment.percent })),
    [segments],
  );

  const colors = useMemo(
    () => [
      theme.colors.chart.blue,
      theme.colors.chart.green,
      theme.colors.chart.cyan,
      theme.colors.chart.amber,
      theme.colors.chart.purple,
      theme.colors.status.neutral,
    ],
    [theme],
  );

  const getFill = useCallback(
    (index: number) => colors[index % colors.length],
    [colors],
  );

  const getTooltipRows = useCallback(
    (segment: { key: PortfolioAllocationKey; value: number }): ChartTooltipRow[] => [
      {
        label: t(`sectors.${segment.key}`),
        value: formatPercent(segment.value, {
          decimals: 1,
          locale,
          showSign: false,
        }),
      },
    ],
    [locale, t],
  );

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: false,
    isEmpty: segments.length === 0,
  });

  const renderChartArea = () => {
    if (effectiveState === "loading") {
      return <SkeletonChart $height="14rem" />;
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
      <AnimatedDonutChart
        data={chartSegments}
        getFill={getFill}
        getTooltipRows={getTooltipRows}
        innerRadius="64%"
        outerRadius="90%"
        paddingAngle={3}
        cornerRadius={4}
      >
        <CenterLabel
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : (CHART_ANIMATION_BEGIN + 200) / 1000,
          }}
        >
          <CenterValue>
            <DisplayMoney
              amount={totalValue}
              currency={currency}
              locale={locale}
              layout="stacked"
            />
          </CenterValue>
          <CenterText>{t("total")}</CenterText>
        </CenterLabel>
      </AnimatedDonutChart>
    );
  };

  return (
    <Card>
      <Header>
        <Title>{t("title")}</Title>
      </Header>
      <Content>
        <ChartWrap>{renderChartArea()}</ChartWrap>
        {effectiveState === "success" ? (
          <Legend>
            {segments.map((segment, index) => (
              <LegendRow key={segment.key}>
                <LegendDot $color={colors[index % colors.length]} />
                <LegendLabel>{t(`sectors.${segment.key}`)}</LegendLabel>
                <LegendValue>
                  {formatPercent(segment.percent, {
                    decimals: 1,
                    locale,
                    showSign: false,
                  })}
                </LegendValue>
              </LegendRow>
            ))}
          </Legend>
        ) : null}
      </Content>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;
`;

const Header = styled.div``;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartWrap = styled.div`
  position: relative;
  inline-size: min(100%, 16rem);
  block-size: 14rem;
  margin-inline: auto;
`;

const CenterLabel = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
`;

const CenterValue = styled.strong`
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const CenterText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const Legend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
  inline-size: 100%;
`;

const LegendRow = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendDot = styled.span<{ $color: string }>`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const LegendValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
