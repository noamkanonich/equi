"use client";

import { Activity, CheckCircle2, Radar } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { useTheme } from "styled-components";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";
import type { WatchlistItem } from "@/data/watchlist/watchlist.types";
import { useIsClient } from "@/utils/client/useIsClient";

type WatchlistExpandedDetailsProps = {
  item: WatchlistItem;
};

export const WatchlistExpandedDetails = ({
  item,
}: WatchlistExpandedDetailsProps) => {
  const t = useTranslations("watchlist");
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");

  return (
    <DetailsGrid>
      <DetailBlock>
        <DetailTitle>
          <Radar size={16} strokeWidth={1.8} aria-hidden />
          {t("expanded.whyWatching")}
        </DetailTitle>
        <DetailText>{t(item.whyWatchingKey)}</DetailText>
      </DetailBlock>

      <DetailBlock>
        <DetailTitle>
          <CheckCircle2 size={16} strokeWidth={1.8} aria-hidden />
          {t("expanded.triggerToAct")}
        </DetailTitle>
        <DetailText>
          {t(item.trigger.detailKey ?? item.trigger.summaryKey)}
        </DetailText>
      </DetailBlock>

      <DetailBlock>
        <DetailTitle>
          <Activity size={16} strokeWidth={1.8} aria-hidden />
          {t("expanded.keyThingsToMonitor")}
        </DetailTitle>
        <MonitorList>
          {item.monitorKeys.map((monitorKey) => (
            <MonitorItem key={monitorKey}>{t(monitorKey)}</MonitorItem>
          ))}
        </MonitorList>
      </DetailBlock>

      <ChartBlock>
        <DetailTitle>{t("expanded.opportunityScoreTrend")}</DetailTitle>
        <ChartFrame role="img" aria-label={t("expanded.opportunityScoreTrend")}>
          {isClient ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={item.opportunityTrend}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={theme.colors.chart.green}
                      stopOpacity={0.22}
                    />
                    <stop
                      offset="100%"
                      stopColor={theme.colors.chart.green}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <YAxis hide domain={["dataMin - 4", "dataMax + 4"]} />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: theme.colors.background.card,
                    borderColor: theme.colors.border.subtle,
                    color: theme.colors.text.primary,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={theme.colors.chart.green}
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={{ r: 3 }}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </ChartFrame>
      </ChartBlock>
    </DetailsGrid>
  );
};

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.25fr) minmax(12rem, 1.2fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.app};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop + 191}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const DetailBlock = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ChartBlock = styled(DetailBlock)`
  min-block-size: 100%;
`;

const DetailTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const DetailText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const MonitorList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-inline-start: ${({ theme }) => theme.spacing.md};
`;

const MonitorItem = styled.li`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ChartFrame = styled.div`
  inline-size: 100%;
  block-size: 7rem;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    block-size: 8rem;
  }
`;
