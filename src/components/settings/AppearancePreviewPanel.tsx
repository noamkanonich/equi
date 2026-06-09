"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import type { AppearanceSettingsState } from "@/data/settings/settings.types";
import { createAppTheme } from "@/lib/theme/theme";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { resolveEffectiveThemeMode } from "@/utils/theme/resolveThemeMode";
import { AppearancePreviewHoldingCard } from "./AppearancePreviewHoldingCard";
import { AppearancePreviewMetricsRow } from "./AppearancePreviewMetricsRow";
import {
  AppearancePreviewAnimationChart,
  AppearancePreviewPortfolioChart,
} from "./AppearancePreviewCharts";
import { CardTitle, ChartSpacer, PreviewCard } from "./appearancePreviewPrimitives";

type AppearancePreviewPanelProps = {
  settings: AppearanceSettingsState;
  revealIndex?: number;
};

const timeRangeKeys = ["1d", "1w", "1m", "3m", "1y", "all"] as const;

export const AppearancePreviewPanel = ({
  settings,
  revealIndex = 6,
}: AppearancePreviewPanelProps) => {
  const t = useTranslations("settings.appearance.preview");
  const prefersReducedMotion = useReducedMotion();
  const cardRadius = `${settings.cardRadius}px`;
  const isCompact = settings.layoutDensity === "compact";
  const padding = isCompact ? "sm" : "md";
  const previewTheme = useMemo(
    () => createAppTheme(resolveEffectiveThemeMode(settings.theme)),
    [settings.theme],
  );

  return (
    <MotionWrap
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={fadeUpVariants}
      transition={getCardRevealTransition(revealIndex, prefersReducedMotion)}
    >
      <Panel $padding="md">
        <PanelHeader>
          <HeaderCopy>
            <PanelTitle>{t("title")}</PanelTitle>
            <PanelSubtitle>{t("subtitle")}</PanelSubtitle>
          </HeaderCopy>
          <LiveBadge>
            <LiveDot aria-hidden />
            {t("livePreview")}
          </LiveBadge>
        </PanelHeader>

        <ThemeProvider theme={previewTheme}>
          <PreviewFrame
            $glow={settings.backgroundGlow}
            $radius={cardRadius}
            $compact={isCompact}
          >
            <PreviewCard $padding={padding} $radius={cardRadius}>
              <PortfolioTopRow>
                <CardTitle>{t("portfolioOverview")}</CardTitle>
                <TimeRangeGroup role="group" aria-label={t("timeRanges.label")}>
                  {timeRangeKeys.map((key) => (
                    <TimeChip key={key} $active={key === "1d"}>
                      {t(`timeRanges.${key}`)}
                    </TimeChip>
                  ))}
                </TimeRangeGroup>
              </PortfolioTopRow>

              <AccountRow>
                <AccountCopy>
                  <FieldLabel>{t("accountValue")}</FieldLabel>
                  <ValueRow>
                    <AccountValue dir="ltr">$128,430.68</AccountValue>
                    <ChangeBadge dir="ltr">{t("dailyChange")}</ChangeBadge>
                  </ValueRow>
                </AccountCopy>
              </AccountRow>

              <AppearancePreviewPortfolioChart
                ariaLabel={t("portfolioOverview")}
                height={isCompact ? 112 : 132}
                animate={settings.chartAnimations}
              />
            </PreviewCard>

            <AppearancePreviewHoldingCard
              cardRadius={cardRadius}
              padding={padding}
              isCompact={isCompact}
            />

            <AppearancePreviewMetricsRow
              cardRadius={cardRadius}
              padding={padding}
              isCompact={isCompact}
            />

            <PreviewCard $padding={padding} $radius={cardRadius}>
              <CardTitle>{t("chartAnimation")}</CardTitle>
              <ChartSpacer />
              <AppearancePreviewAnimationChart
                ariaLabel={t("chartAnimation")}
                height={isCompact ? 72 : 88}
                animate={settings.chartAnimations}
              />
            </PreviewCard>
          </PreviewFrame>
        </ThemeProvider>
      </Panel>
    </MotionWrap>
  );
};

const MotionWrap = styled(motion.div)`
  min-inline-size: 0;
`;

const Panel = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
  position: sticky;
  inset-block-start: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    position: static;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderCopy = styled.div`
  min-inline-size: 0;
`;

const PanelTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const PanelSubtitle = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.status.positive};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const LiveDot = styled.span`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.status.positive};
`;

const PreviewFrame = styled.div<{
  $glow: number;
  $radius: string;
  $compact: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $compact }) =>
    $compact ? theme.spacing.sm : theme.spacing.md};
  padding: ${({ theme, $compact }) =>
    $compact ? theme.spacing.sm : theme.spacing.md};
  border-radius: ${({ $radius }) => $radius};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.elevated};
  box-shadow:
    0 0 ${({ $glow }) => $glow * 0.45}px
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} ${({ $glow }) => Math.min($glow + 10, 100)}%,
        transparent
      ),
    0 0 ${({ $glow }) => $glow * 0.9}px
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} ${({ $glow }) => $glow * 0.35}%,
        transparent
      );
  transition: box-shadow 0.25s ease;
`;

const PortfolioTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TimeRangeGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeChip = styled.span<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background.card : "transparent"};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  white-space: nowrap;
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.colors.shadow.soft : "none"};
`;

const AccountRow = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const AccountCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const ValueRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AccountValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.02em;
`;

const ChangeBadge = styled.span`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
