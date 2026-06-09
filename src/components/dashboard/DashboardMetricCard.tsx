"use client";

import { WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import styled, { css } from "styled-components";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { PortfolioAverageScore } from "@/components/dashboard/PortfolioAverageScore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { DashboardMetric } from "@/data/dashboard/dashboard.types";
import { useAppStore } from "@/store/app.store";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { formatMoney } from "@/utils/currencies/formatMoney";
import { getDisplayMoney } from "@/utils/currencies/getDisplayMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";

const COUNT_UP_STAGGER_MS = 80;

type DashboardMetricCardProps = {
  metric: DashboardMetric;
  locale: string;
  cardIndex?: number;
  replayKey?: number;
};

type MetricAnimatedMoneyProps = {
  amount: number;
  currency: CurrencyCode;
  locale: string;
  animationDelay: number;
  replayKey: number;
};

const MetricAnimatedMoney = ({
  amount,
  currency,
  locale,
  animationDelay,
  replayKey,
}: MetricAnimatedMoneyProps) => {
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);

  const convertedAmount = convertCurrency({
    amount,
    fromCurrency: currency,
    toCurrency: displayCurrency,
    fxRates,
  });

  const { secondary, showSecondary } = getDisplayMoney({
    amount,
    originalCurrency: currency,
    displayCurrency,
    locale,
    fxRates,
  });

  const formatConverted = useCallback(
    (value: number) => formatMoney(value, displayCurrency, { locale }),
    [displayCurrency, locale],
  );

  if (!showSecondary || !secondary) {
    return (
      <AnimatedNumber
        value={convertedAmount}
        formatter={formatConverted}
        delay={animationDelay}
        replayKey={replayKey}
      />
    );
  }

  return (
    <MoneyWrap>
      <AnimatedNumber
        value={convertedAmount}
        formatter={formatConverted}
        delay={animationDelay}
        replayKey={replayKey}
      />
      <FxSecondary dir="ltr">({secondary})</FxSecondary>
    </MoneyWrap>
  );
};

export const DashboardMetricCard = ({
  metric,
  locale,
  cardIndex = 0,
  replayKey = 0,
}: DashboardMetricCardProps) => {
  const t = useTranslations("dashboard");
  const isScore = metric.kind === "portfolioScore";
  const isCash = metric.kind === "cashAvailable";
  const hasTrend = metric.trend.length > 0;
  const animationDelay = cardIndex * COUNT_UP_STAGGER_MS;

  const secondaryValue =
    metric.secondaryValue === undefined
      ? undefined
      : isCash
        ? t("metrics.availableToInvest")
        : formatPercent(metric.secondaryValue, { locale });

  if (isScore) {
    return (
      <ScoreCard>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
        <PortfolioAverageScore
          score={metric.scoreValue ?? metric.value}
          segments={metric.scoreBreakdown ?? []}
          animationDelay={animationDelay}
          replayKey={replayKey}
        />
      </ScoreCard>
    );
  }

  return (
    <Card $hasTrend={hasTrend}>
      <Content>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
        <ValueGroup>
          <Value>
            <MetricAnimatedMoney
              amount={metric.value}
              currency={metric.currency}
              locale={locale}
              animationDelay={animationDelay}
              replayKey={replayKey}
            />
          </Value>
          {secondaryValue ? (
            <Secondary $tone={metric.tone}>{secondaryValue}</Secondary>
          ) : null}
        </ValueGroup>
      </Content>

      {hasTrend ? (
        <ChartWrap>
          <MiniSparklineChart
            data={metric.trend}
            variant={metric.tone}
            height={34}
            ariaLabel={t(`metrics.${metric.kind}`)}
          />
        </ChartWrap>
      ) : (
        <IconWrap aria-hidden>
          <WalletCards size={24} strokeWidth={1.7} />
        </IconWrap>
      )}
    </Card>
  );
};

const cardChrome = css`
  block-size: 100%;
  min-block-size: 9.5rem;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  overflow: hidden;
  transition:
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.32s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-0.125rem);
    border-color: ${({ theme }) => theme.colors.border.strong};
    box-shadow: ${({ theme }) => theme.colors.shadow.card};
  }
`;

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
  `,
};

const ScoreCard = styled.article`
  ${cardChrome}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Card = styled.article<{ $hasTrend?: boolean }>`
  ${cardChrome}
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(6.25rem, 34%);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  ${({ $hasTrend, theme }) =>
    $hasTrend &&
    css`
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(0, 1fr) auto;
      align-items: stretch;
      gap: ${theme.spacing.sm};
      padding-block-end: ${theme.spacing.md};
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr) minmax(5.25rem, 6.5rem);

    ${({ $hasTrend }) =>
      $hasTrend &&
      css`
        grid-template-columns: minmax(0, 1fr);
      `}
  }
`;

const Content = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const ValueGroup = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Value = styled.strong`
  min-inline-size: 0;
  max-inline-size: 100%;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.size.xl},
    1.65vw,
    ${({ theme }) => theme.typography.size.xxl}
  );
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.03em;
`;

const MoneyWrap = styled.span`
  max-inline-size: 100%;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const FxSecondary = styled.span`
  max-inline-size: 100%;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Secondary = styled.span<{ $tone: DashboardMetric["tone"] }>`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  ${({ $tone }) => toneStyles[$tone]}
`;

const ChartWrap = styled.div`
  align-self: center;
  inline-size: 100%;
  max-inline-size: 100%;
  min-inline-size: 0;
  justify-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    max-inline-size: 100%;
  }
`;

const IconWrap = styled.div`
  inline-size: 3.5rem;
  block-size: 3.5rem;
  justify-self: end;
  align-self: center;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;
