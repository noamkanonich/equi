"use client";

import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import type { SuggestedAction } from "@/data/scoring/scoring.types";
import { mapSuggestedActionToTone } from "@/utils/scoring/mappers";

type ActionBadgeProps = {
  action: SuggestedAction;
  children: ReactNode;
  className?: string;
};

export const ActionBadge = ({ action, children, className }: ActionBadgeProps) => {
  return (
    <Wrapper className={className} $tone={mapSuggestedActionToTone(action)}>
      {children}
    </Wrapper>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.status.neutral};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
};

const Wrapper = styled.span<{ $tone: keyof typeof toneStyles }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
  ${({ $tone }) => toneStyles[$tone]}
`;

