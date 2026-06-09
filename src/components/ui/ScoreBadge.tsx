"use client";

import styled, { css } from "styled-components";

type ScoreBadgeTone = "positive" | "warning" | "negative";

type ScoreBadgeProps = {
  score: number;
  $tone?: ScoreBadgeTone;
};

export const ScoreBadge = ({ score, $tone = "positive" }: ScoreBadgeProps) => {
  return <Wrapper $score={score} $tone={$tone}>{score}</Wrapper>;
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background:
      linear-gradient(
        ${({ theme }) => theme.colors.background.card},
        ${({ theme }) => theme.colors.background.card}
      ) padding-box,
      conic-gradient(
        ${({ theme }) => theme.colors.status.positive} calc(var(--score) * 1%),
        ${({ theme }) => theme.colors.status.positiveSoft} 0
      ) border-box;
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background:
      linear-gradient(
        ${({ theme }) => theme.colors.background.card},
        ${({ theme }) => theme.colors.background.card}
      ) padding-box,
      conic-gradient(
        ${({ theme }) => theme.colors.status.warning} calc(var(--score) * 1%),
        ${({ theme }) => theme.colors.status.warningSoft} 0
      ) border-box;
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background:
      linear-gradient(
        ${({ theme }) => theme.colors.background.card},
        ${({ theme }) => theme.colors.background.card}
      ) padding-box,
      conic-gradient(
        ${({ theme }) => theme.colors.status.negative} calc(var(--score) * 1%),
        ${({ theme }) => theme.colors.status.negativeSoft} 0
      ) border-box;
  `,
};

const Wrapper = styled.span<{ $score: number; $tone: ScoreBadgeTone }>`
  --score: ${({ $score }) => Math.max(0, Math.min(100, $score))};

  inline-size: 2rem;
  block-size: 2rem;
  border: 0.1875rem solid transparent;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  ${({ $tone }) => toneStyles[$tone]}
`;
