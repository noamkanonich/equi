"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type { DashboardChartSegment } from "@/data/dashboard/dashboard.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type SectorExposureCardProps = {
  segments: DashboardChartSegment[];
  locale: string;
};

export const SectorExposureCard = ({
  segments,
  locale,
}: SectorExposureCardProps) => {
  const t = useTranslations("dashboard");
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const colors = [
    theme.colors.chart.green,
    theme.colors.chart.blue,
    theme.colors.chart.amber,
    theme.colors.chart.purple,
    theme.colors.chart.cyan,
  ];

  return (
    <Card>
      <Title>{t("cards.sectorExposure")}</Title>
      <List>
        {segments.map((segment, index) => (
          <Row
            key={segment.key}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(undefined)}
          >
            <RowHeader>
              <LabelGroup>
                <Dot $color={colors[index % colors.length]} />
                <Label>{t(`charts.labels.${segment.key}`)}</Label>
              </LabelGroup>
              <Value>
                {formatPercent(segment.value, {
                  decimals: 0,
                  locale,
                  showSign: false,
                })}
              </Value>
            </RowHeader>
            <Track>
              <Bar
                $value={segment.value}
                $color={colors[index % colors.length]}
                $index={index}
                $animate={!prefersReducedMotion}
                $dimmed={
                  activeIndex !== undefined && activeIndex !== index
                }
              />
            </Track>
          </Row>
        ))}
      </List>
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LabelGroup = styled.div`
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Dot = styled.span<{ $color: string }>`
  inline-size: 0.55rem;
  block-size: 0.55rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const Label = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Track = styled.div`
  overflow: hidden;
  block-size: 0.45rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.status.neutralSoft};
`;

const Bar = styled.div<{
  $value: number;
  $color: string;
  $index: number;
  $animate: boolean;
  $dimmed: boolean;
}>`
  inline-size: ${({ $value }) => Math.max(0, Math.min(100, $value))}%;
  block-size: 100%;
  border-radius: inherit;
  background: ${({ $color }) => $color};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.55 : 1)};
  transform-origin: inline-start;
  transform: ${({ $animate }) => ($animate ? "scaleX(0)" : "scaleX(1)")};
  animation: ${({ $animate }) => ($animate ? "barGrow 0.7s ease-out forwards" : "none")};
  animation-delay: ${({ $index }) => `${0.08 * $index}s`};
  transition: opacity 0.18s ease;

  @keyframes barGrow {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
`;
