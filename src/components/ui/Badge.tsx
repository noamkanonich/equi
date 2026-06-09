"use client";

import type { HTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";

type BadgeTone = "neutral" | "positive" | "negative" | "warning";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  $tone?: BadgeTone;
};

export const Badge = ({
  children,
  $tone = "neutral",
  ...props
}: BadgeProps) => {
  return (
    <StyledBadge $tone={$tone} {...props}>
      {children}
    </StyledBadge>
  );
};

const toneStyles = {
  neutral: css`
    background: ${({ theme }) => theme.colors.status.neutralSoft};
    color: ${({ theme }) => theme.colors.status.neutral};
  `,
  positive: css`
    background: ${({ theme }) => theme.colors.status.positiveSoft};
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    background: ${({ theme }) => theme.colors.status.negativeSoft};
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.status.warningSoft};
    color: ${({ theme }) => theme.colors.status.warning};
  `,
};

const StyledBadge = styled.span<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  ${({ $tone }) => toneStyles[$tone]}
`;
