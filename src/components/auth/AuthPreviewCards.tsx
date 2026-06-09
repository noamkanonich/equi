"use client";

import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { keyframes, useTheme } from "styled-components";
import { authFloatSlow, authHeroReveal } from "@/components/auth/authMotion";
import type { AppTheme } from "@/lib/theme/theme";
const SPARKLINE_POINTS = [44, 48, 46, 53, 51, 58, 56, 64, 62, 70, 76];
const WATCHLIST_ROWS = [
  { ticker: "AAPL", changeKey: "watchlistChange1" },
  { ticker: "MSFT", changeKey: "watchlistChange2" },
  { ticker: "NVDA", changeKey: "watchlistChange3" },
] as const;
const buildSparklinePath = (points: number[], width: number, height: number) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);

  return points
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * (height - 6) - 3;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
};

const buildSparklineArea = (points: number[], width: number, height: number) =>
  `${buildSparklinePath(points, width, height)} L${width},${height} L0,${height} Z`;
const isPositiveChange = (value: string) => !value.trim().startsWith("-");
type MiniSparklineProps = {
  theme: AppTheme;
};
const MiniSparkline = ({ theme }: MiniSparklineProps) => {
  const width = 260;
  const height = 72;
  const linePath = buildSparklinePath(SPARKLINE_POINTS, width, height);
  const areaPath = buildSparklineArea(SPARKLINE_POINTS, width, height);

  return (
    <SparklineSvg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      focusable="false"
    >
      <path d={areaPath} fill={theme.colors.chart.sparklineFill.positive} />
      <SparklinePath d={linePath} />
    </SparklineSvg>
  );
};

export const AuthPreviewCards = () => {
  const tMock = useTranslations("authWelcome.mockPreview");
  const tVisual = useTranslations("authWelcome.visual");
  const theme = useTheme();

  return (
    <PreviewZone aria-hidden>
      <PreviewShell $revealDelay="0.22s">
        <ShellHeader>
          <WindowControls>
            <WindowDot />
            <WindowDot />
            <WindowDot />
          </WindowControls>
          <SecurePill>
            <ShieldCheck size={14} strokeWidth={1.8} />
            <span>{tMock("synced")}</span>
          </SecurePill>
        </ShellHeader>

        <PortfolioPanel $floatDelay="0s" $revealDelay="0.28s">
          <PanelTop>
            <CardHeader>
              <CardIcon>
                <BriefcaseBusiness size={16} strokeWidth={1.75} />
              </CardIcon>
              <CardLabel>{tMock("portfolio")}</CardLabel>
            </CardHeader>
            <StatusChip>
              <CheckCircle2 size={14} strokeWidth={1.8} />
              <span>{tVisual("todayChange")}</span>
            </StatusChip>
          </PanelTop>

          <PortfolioMain>
            <MetricBlock>
              <MetricValue>{tVisual("portfolioValue")}</MetricValue>
              <MetricHint>
                <TrendingUp size={15} strokeWidth={1.8} />
                <span>{tVisual("watchlistReady")}</span>
              </MetricHint>
            </MetricBlock>
            <SparklineWrap>
              <MiniSparkline theme={theme} />
            </SparklineWrap>
          </PortfolioMain>
        </PortfolioPanel>

        <LowerGrid>
          <WatchlistPanel $floatDelay="0.7s" $revealDelay="0.34s">
            <PanelTop>
              <CardHeader>
                <CardIcon>
                  <Bookmark size={16} strokeWidth={1.75} />
                </CardIcon>
                <CardLabel>{tMock("watchlist")}</CardLabel>
              </CardHeader>
            </PanelTop>

            <TickerList>
              {WATCHLIST_ROWS.map(({ ticker, changeKey }) => {
                const change = tVisual(changeKey);

                return (
                  <TickerRow key={ticker}>
                    <TickerSymbol>{ticker}</TickerSymbol>
                    <TickerChange $positive={isPositiveChange(change)}>
                      {change}
                    </TickerChange>
                  </TickerRow>
                );
              })}
            </TickerList>
          </WatchlistPanel>

          <InsightPanel $floatDelay="1.1s" $revealDelay="0.4s">
            <PanelTop>
              <CardHeader>
                <CardIcon>
                  <Sparkles size={16} strokeWidth={1.75} />
                </CardIcon>
                <CardLabel>{tMock("notes")}</CardLabel>
              </CardHeader>
            </PanelTop>

            <NoteStack>
              <NoteLine>{tVisual("notePreviewLine1")}</NoteLine>
              <NoteLine>{tVisual("notePreviewLine2")}</NoteLine>
            </NoteStack>
          </InsightPanel>
        </LowerGrid>

        <AlertRail $floatDelay="1.5s" $revealDelay="0.46s">
          <CardHeader>
            <CardIcon>
              <Bell size={16} strokeWidth={1.75} />
            </CardIcon>
            <CardLabel>{tMock("alerts")}</CardLabel>
          </CardHeader>
          <AlertItems>
            <AlertChip>{tVisual("alertsCount")}</AlertChip>
            <AlertText>{tVisual("alertItemPrice")}</AlertText>
            <AlertText>{tVisual("alertItemPortfolio")}</AlertText>
          </AlertItems>
        </AlertRail>
      </PreviewShell>
    </PreviewZone>
  );
};

const drawLine = keyframes`
  from {
    stroke-dashoffset: 420;
  }
  to {
    stroke-dashoffset: 0;
  }
`;
const PreviewZone = styled.div`
  inline-size: 100%;
  margin-block-start: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    margin-block-start: ${({ theme }) => theme.spacing.sm};
  }
`;

const PreviewShell = styled.div<{ $revealDelay: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  inline-size: min(100%, 33rem);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  overflow: hidden;
  ${({ $revealDelay }) => authHeroReveal($revealDelay)};
  &::before {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 7rem;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.background.soft},
      transparent
    );
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

const ShellHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const WindowControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const WindowDot = styled.span`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border.strong};
`;

const SecurePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;

const PreviewPanel = styled.article<{
  $floatDelay: string;
  $revealDelay: string;
}>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.elevated};
  ${({ $revealDelay }) => authHeroReveal($revealDelay)};
  ${({ $floatDelay }) => authFloatSlow($floatDelay, "7s")};
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const PortfolioPanel = styled(PreviewPanel)`
  min-block-size: 13.75rem;
`;

const LowerGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const WatchlistPanel = styled(PreviewPanel)``;

const InsightPanel = styled(PreviewPanel)``;

const PanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const CardIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  flex-shrink: 0;
`;

const CardLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;

const PortfolioMain = styled.div`
  display: grid;
  grid-template-columns: minmax(9rem, 0.7fr) minmax(0, 1fr);
  align-items: end;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MetricBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MetricValue = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const MetricHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const SparklineWrap = styled.div`
  min-inline-size: 0;
  padding-block-start: ${({ theme }) => theme.spacing.lg};
`;

const SparklineSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 5rem;
  overflow: visible;
`;

const SparklinePath = styled.path`
  fill: none;
  stroke: ${({ theme }) => theme.colors.chart.green};
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 420;
  animation: ${drawLine} 1.1s ease-out 0.45s both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const TickerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const TickerRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-block-size: 2.25rem;
  padding-inline: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const TickerSymbol = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  direction: ltr;
`;

const TickerChange = styled.span<{ $positive: boolean }>`
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.status.positive : theme.colors.status.negative};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  direction: ltr;
`;

const NoteStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NoteLine = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-align: start;
`;

const AlertRail = styled(PreviewPanel)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const AlertItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AlertChip = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;

const AlertText = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
`;
