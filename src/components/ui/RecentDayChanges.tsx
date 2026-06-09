"use client";

import styled, { css } from "styled-components";
import { formatPercent } from "@/utils/formatting/formatPercent";

type RecentDayChangeTone = "positive" | "negative" | "neutral";

type RecentDayChangesProps = {
  changes: number[];
  locale: string;
  compact?: boolean;
};

const mapChangeToTone = (change: number): RecentDayChangeTone => {
  if (change > 0) return "positive";
  if (change < 0) return "negative";
  return "neutral";
};

export const RecentDayChanges = ({
  changes,
  locale,
  compact = false,
}: RecentDayChangesProps) => {
  return (
    <Wrap dir="ltr" $compact={compact}>
      {changes.map((change, index) => (
        <ChangeValue key={`${index}-${change}`} $tone={mapChangeToTone(change)}>
          {formatPercent(change, { locale, decimals: 2 })}
        </ChangeValue>
      ))}
    </Wrap>
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
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
};

const Wrap = styled.div<{ $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme, $compact }) =>
    $compact ? theme.spacing.xs : theme.spacing.sm};
  flex-wrap: nowrap;
`;

const ChangeValue = styled.span<{ $tone: RecentDayChangeTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 2.75rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
  ${({ $tone }) => toneStyles[$tone]}
`;
