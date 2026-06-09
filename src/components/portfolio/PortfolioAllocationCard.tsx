"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import { Link } from "@/i18n/routing";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { PortfolioAllocationSegment } from "@/data/portfolio/portfolio.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { CHART_ANIMATION_BEGIN } from "@/utils/charts/chartAnimation";
import { formatPercent } from "@/utils/formatting/formatPercent";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_EMPTY = false;

type PortfolioAllocationCardProps = {
  segments: PortfolioAllocationSegment[];
  totalValue: number;
  currency: CurrencyCode;
  locale: string;
  dataState?: DataState;
};

export const PortfolioAllocationCard = ({
  segments,
  totalValue,
  currency,
  locale,
  dataState,
}: PortfolioAllocationCardProps) => {
  const t = useTranslations("portfolio");
  const tStates = useTranslations("states");
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();

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
    (segment: PortfolioAllocationSegment): ChartTooltipRow[] => [
      {
        label: t(`allocation.${segment.key}`),
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
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: DEV_SIMULATE_EMPTY || segments.length === 0,
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
        data={segments}
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
          <CenterText>{t("allocation.total")}</CenterText>
        </CenterLabel>
      </AnimatedDonutChart>
    );
  };

  return (
    <Card>
      <Header>
        <Title>{t("allocation.title")}</Title>
      </Header>
      <Content>
        <ChartWrap>{renderChartArea()}</ChartWrap>
        {effectiveState === "success" ? (
        <Legend>
          {segments.map((segment, index) => (
            <LegendRow key={segment.key}>
              <LegendDot $color={colors[index % colors.length]} />
              <LegendLabel>{t(`allocation.${segment.key}`)}</LegendLabel>
              <LegendValue>
                {formatPercent(segment.value, {
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
      <FooterLink href="/portfolio">{t("actions.viewFullAllocation")}</FooterLink>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  block-size: 100%;
  min-block-size: 24rem;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartWrap = styled.div`
  inline-size: min(100%, 16rem);
  block-size: 14rem;
  margin-inline: auto;
`;

const CenterLabel = styled(motion.div)`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
`;

const CenterValue = styled.strong`
  display: flex;
  inline-size: min(100%, 9.5rem);
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: center;
  direction: ltr;
  unicode-bidi: isolate;

  > span {
    align-items: center;
    inline-size: 100%;
  }
`;

const CenterText = styled.span`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
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

const FooterLink = styled(Link)`
  display: inline-block;
  margin-block-start: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-align: start;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
