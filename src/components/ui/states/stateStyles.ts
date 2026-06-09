"use client";

import styled, { css } from "styled-components";

export const stateCenteredLayout = css<{ $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme, $compact }) => ($compact ? theme.spacing.xs : theme.spacing.sm)};
  padding: ${({ theme, $compact }) =>
    $compact ? `${theme.spacing.lg} ${theme.spacing.md}` : theme.spacing.xl};
  min-inline-size: 0;
`;

export const StateIconWrap = styled.span<{ $tone?: "neutral" | "warning" | "negative" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $tone }) => {
    if ($tone === "warning") return theme.colors.status.warningSoft;
    if ($tone === "negative") return theme.colors.status.negativeSoft;
    return theme.colors.background.soft;
  }};
  color: ${({ theme, $tone }) => {
    if ($tone === "warning") return theme.colors.status.warning;
    if ($tone === "negative") return theme.colors.status.negative;
    return theme.colors.text.secondary;
  }};
`;

export const StateTitle = styled.h3<{ $compact?: boolean }>`
  margin: 0;
  font-size: ${({ theme, $compact }) =>
    $compact
      ? theme.typography.preset.caption.fontSize
      : theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StateDescription = styled.p`
  margin: 0;
  max-inline-size: 24rem;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StateActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StateWrapper = styled.div<{ $compact?: boolean }>`
  ${stateCenteredLayout}
`;
