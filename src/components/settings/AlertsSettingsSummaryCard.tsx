"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import { Card } from "@/components/ui/Card";
import type {
  AlertSettingsState,
  AlertSettingsSummarySegment,
} from "@/data/settings/settings.types";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { getAlertChartColor } from "@/utils/alerts/getAlertChartColor";
import { buildAlertsSummarySegments } from "@/utils/settings/buildAlertsSummarySegments";
import { CHART_ANIMATION_BEGIN } from "@/utils/charts/chartAnimation";

const summaryLabelKeys = {
  price: "priceAlerts",
  earnings: "earningsAlerts",
  portfolio: "portfolioAlerts",
  buyZone: "buyZoneAlerts",
  score: "scoreAlerts",
  smartReplace: "smartReplace",
} as const;

type AlertsSettingsSummaryCardProps = {
  draft: AlertSettingsState;
};

export const AlertsSettingsSummaryCard = ({ draft }: AlertsSettingsSummaryCardProps) => {
  const t = useTranslations("settings.alerts.summary");
  const locale = useLocale();
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const { segments, activeCount } = useMemo(
    () => buildAlertsSummarySegments(draft),
    [draft],
  );

  const getFill = useCallback(
    (_index: number, segment: AlertSettingsSummarySegment) =>
      getAlertChartColor(segment.key, theme),
    [theme],
  );

  const getTooltipRows = useCallback(
    (segment: AlertSettingsSummarySegment): ChartTooltipRow[] => [
      {
        label: t(summaryLabelKeys[segment.key]),
        value: `${segment.value} (${formatPercent(segment.percent, { decimals: 0, locale, showSign: false })})`,
      },
    ],
    [locale, t],
  );

  return (
    <StyledCard $padding="md">
      <Header>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
      </Header>

      <ChartSection>
        <ChartWrap>
          <AnimatedDonutChart
            data={segments}
            getFill={getFill}
            getTooltipRows={getTooltipRows}
            innerRadius="68%"
            outerRadius="92%"
            paddingAngle={3}
            cornerRadius={4}
            activeRadiusOffset={3}
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
              <ActiveValue>{activeCount}</ActiveValue>
              <ActiveLabel>{t("activeLabel")}</ActiveLabel>
            </CenterLabel>
          </AnimatedDonutChart>
        </ChartWrap>

        <Legend>
          {segments.map((segment) => (
            <LegendRow key={segment.key}>
              <LegendSwatch $color={getAlertChartColor(segment.key, theme)} />
              <LegendLabel>{t(summaryLabelKeys[segment.key])}</LegendLabel>
              <LegendMeta dir="ltr">
                {segment.value}{" "}
                <LegendPercent>
                  ({formatPercent(segment.percent, { decimals: 0, locale, showSign: false })})
                </LegendPercent>
              </LegendMeta>
            </LegendRow>
          ))}
        </Legend>
      </ChartSection>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChartWrap = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 11rem;
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

const ActiveValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ActiveLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendSwatch = styled.span<{ $color: string }>`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const LegendMeta = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  white-space: nowrap;
`;

const LegendPercent = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;
