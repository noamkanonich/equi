"use client";

import { ArrowDownRight, ArrowUpRight, Minus, TriangleAlert } from "lucide-react";
import styled, { css } from "styled-components";
import type { NextMoveMetricChip as NextMoveMetricChipType } from "@/data/next-moves/next-moves.types";
import { getMetricTrendTone } from "@/utils/next-moves/getNextMoveStatusColor";

type NextMoveMetricChipProps = {
  metric: NextMoveMetricChipType;
  label: string;
  value: string;
};

export const NextMoveMetricChip = ({
  metric,
  label,
  value,
}: NextMoveMetricChipProps) => {
  const tone = getMetricTrendTone(metric.trend);
  const Icon =
    metric.trend === "up"
      ? ArrowUpRight
      : metric.trend === "down"
        ? ArrowDownRight
        : metric.trend === "warning"
          ? TriangleAlert
          : Minus;

  return (
    <Chip $tone={tone}>
      <Label>{label}</Label>
      <Value dir="auto">{value}</Value>
      <Icon size={13} strokeWidth={2} aria-hidden />
    </Chip>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
};

const Chip = styled.span<{ $tone: keyof typeof toneStyles }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-block-size: 1.85rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
  ${({ $tone }) => toneStyles[$tone]}
`;

const Label = styled.span`
  color: currentColor;
  opacity: 0.72;
`;

const Value = styled.strong`
  color: currentColor;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;
