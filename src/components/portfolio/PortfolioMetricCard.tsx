"use client";

import { WalletCards } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import styled, { css } from "styled-components";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CircularScore } from "@/components/ui/CircularScore";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { PortfolioMetric } from "@/data/portfolio/portfolio.types";
import { useAppStore } from "@/store/app.store";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { formatMoney } from "@/utils/currencies/formatMoney";
import { getDisplayMoney } from "@/utils/currencies/getDisplayMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";

const COUNT_UP_STAGGER_MS = 70;

type PortfolioMetricCardProps = {
  metric: PortfolioMetric;
  holdingsCount: number;
  locale: string;
  cardIndex?: number;
};

type AnimatedMoneyProps = {
  amount: number;
  currency: CurrencyCode;
  locale: string;
  animationDelay: number;
};

const AnimatedMoney = ({
  amount,
  currency,
  locale,
  animationDelay,
}: AnimatedMoneyProps) => {
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);

  const convertedAmount = convertCurrency({
    amount,
    fromCurrency: currency,
    toCurrency: displayCurrency,
    fxRates,
  });

  const display = getDisplayMoney({
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

  return (
    <MoneyWrap>
      <AnimatedNumber
        value={convertedAmount}
        formatter={formatConverted}
        delay={animationDelay}
      />
      {display.showSecondary && display.secondary ? (
        <FxSecondary dir="ltr">({display.secondary})</FxSecondary>
      ) : null}
    </MoneyWrap>
  );
};

export const PortfolioMetricCard = ({
  metric,
  holdingsCount,
  locale,
  cardIndex = 0,
}: PortfolioMetricCardProps) => {
  const t = useTranslations("portfolio");
  const animationDelay = cardIndex * COUNT_UP_STAGGER_MS;
  const isScore = metric.kind === "portfolioScore";
  const hasTrend = metric.trend.length > 0;

  const secondaryValue =
    metric.secondaryKind === "percent" && metric.secondaryValue !== undefined
      ? formatPercent(metric.secondaryValue, { locale })
      : metric.kind === "cashAvailable"
        ? t("metrics.availableToInvest")
        : metric.kind === "portfolioScore"
          ? t("metrics.scoreCount", { count: holdingsCount })
          : undefined;

  if (isScore) {
    return (
      <ScoreCard>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
        <ScoreBody>
          <CircularScore
            score={metric.value}
            size="md"
            showBase={false}
            ariaLabel={t("metrics.scoreAria", { score: metric.value })}
          />
          <ScoreLegend>
            <ScoreValue>
              {metric.value}
              <ScoreBase>{t("metrics.scoreBase")}</ScoreBase>
            </ScoreValue>
            {metric.scoreBreakdown?.slice(0, 4).map((segment) => (
              <LegendRow key={segment.key}>
                <LegendDot $tier={segment.key} />
                <LegendLabel>{t(`scoreDistribution.${segment.key}`)}</LegendLabel>
                <LegendValue>{segment.value}</LegendValue>
              </LegendRow>
            ))}
          </ScoreLegend>
        </ScoreBody>
      </ScoreCard>
    );
  }

  return (
    <Card>
      <Content>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
        <ValueGroup>
          <Value>
            {metric.currency ? (
              <AnimatedMoney
                amount={metric.value}
                currency={metric.currency}
                locale={locale}
                animationDelay={animationDelay}
              />
            ) : (
              <AnimatedNumber
                value={metric.value}
                decimals={0}
                formatter={(value) => String(Math.round(value))}
                delay={animationDelay}
              />
            )}
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
            height={58}
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
  min-block-size: 8.75rem;
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

  @media (hover: hover) {
    &:hover {
      transform: translateY(-0.125rem);
      border-color: ${({ theme }) => theme.colors.border.strong};
      box-shadow: ${({ theme }) => theme.colors.shadow.card};
    }
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

const tierStyles = {
  great: css`
    background: ${({ theme }) => theme.colors.scoreTier.great};
  `,
  good: css`
    background: ${({ theme }) => theme.colors.scoreTier.good};
  `,
  watch: css`
    background: ${({ theme }) => theme.colors.scoreTier.watch};
  `,
  avoid: css`
    background: ${({ theme }) => theme.colors.scoreTier.avoid};
  `,
};

const Card = styled.article`
  ${cardChrome}
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ScoreCard = styled.article`
  ${cardChrome}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.03em;
`;

const MoneyWrap = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FxSecondary = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
`;

const Secondary = styled.span<{ $tone: PortfolioMetric["tone"] }>`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  ${({ $tone }) => toneStyles[$tone]}
`;

const ChartWrap = styled.div`
  inline-size: 100%;
  min-inline-size: 0;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
`;

const IconWrap = styled.div`
  inline-size: 3.25rem;
  block-size: 3.25rem;
  justify-self: end;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const ScoreBody = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ScoreLegend = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ScoreValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ScoreBase = styled.span`
  margin-inline-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LegendDot = styled.span<{ $tier: keyof typeof tierStyles }>`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  ${({ $tier }) => tierStyles[$tier]}
`;

const LegendLabel = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LegendValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;
