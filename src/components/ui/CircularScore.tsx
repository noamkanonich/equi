"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled, { css } from "styled-components";
import { mapScoreToTone } from "@/utils/scoring/mappers";

type CircularScoreSize = "sm" | "md" | "lg";

type CircularScoreProps = {
  score: number;
  size?: CircularScoreSize;
  showBase?: boolean;
  ariaLabel?: string;
};

const SIZE_MAP: Record<CircularScoreSize, { dimension: string; stroke: number; scoreFont: keyof import("@/lib/theme/theme").AppTheme["typography"]["size"]; baseFont: keyof import("@/lib/theme/theme").AppTheme["typography"]["size"] }> = {
  sm: { dimension: "2.75rem", stroke: 4, scoreFont: "sm", baseFont: "xs" },
  md: { dimension: "4.5rem", stroke: 5, scoreFont: "lg", baseFont: "xs" },
  lg: { dimension: "6.5rem", stroke: 6, scoreFont: "xl", baseFont: "sm" },
};

const toneStroke = {
  positive: css`
    stroke: ${({ theme }) => theme.colors.status.positive};
  `,
  warning: css`
    stroke: ${({ theme }) => theme.colors.status.warning};
  `,
  negative: css`
    stroke: ${({ theme }) => theme.colors.status.negative};
  `,
  neutral: css`
    stroke: ${({ theme }) => theme.colors.status.neutral};
  `,
};

export const CircularScore = ({
  score,
  size = "md",
  showBase = true,
  ariaLabel,
}: CircularScoreProps) => {
  const prefersReducedMotion = useReducedMotion();
  const normalized = Math.max(0, Math.min(100, score));
  const tone = mapScoreToTone(normalized);
  const config = SIZE_MAP[size];
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <Wrapper
      $dimension={config.dimension}
      role="img"
      aria-label={ariaLabel ?? `${normalized}/100`}
    >
      <Svg viewBox="0 0 100 100" aria-hidden>
        <TrackCircle cx="50" cy="50" r={radius} $strokeWidth={config.stroke} />
        <ScoreCircle
          as={motion.circle}
          cx="50"
          cy="50"
          r={radius}
          $strokeWidth={config.stroke}
          $tone={tone}
          strokeDasharray={circumference}
          initial={prefersReducedMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <Center $size={size}>
        <ScoreValue $size={size}>{normalized}</ScoreValue>
        {showBase ? <ScoreBase $size={size}>/100</ScoreBase> : null}
      </Center>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $dimension: string }>`
  position: relative;
  inline-size: ${({ $dimension }) => $dimension};
  block-size: ${({ $dimension }) => $dimension};
  flex-shrink: 0;
`;

const Svg = styled.svg`
  inline-size: 100%;
  block-size: 100%;
`;

const TrackCircle = styled.circle<{ $strokeWidth: number }>`
  fill: none;
  stroke: ${({ theme }) => theme.colors.background.soft};
  stroke-width: ${({ $strokeWidth }) => $strokeWidth};
`;

const ScoreCircle = styled.circle<{ $strokeWidth: number; $tone: keyof typeof toneStroke }>`
  fill: none;
  stroke-linecap: round;
  stroke-width: ${({ $strokeWidth }) => $strokeWidth};
  ${({ $tone }) => toneStroke[$tone]}
`;

const Center = styled.div<{ $size: CircularScoreSize }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  gap: ${({ $size }) => ($size === "lg" ? "0" : "0.0625rem")};
`;

const ScoreValue = styled.strong<{ $size: CircularScoreSize }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme, $size }) => theme.typography.size[SIZE_MAP[$size].scoreFont]};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ScoreBase = styled.span<{ $size: CircularScoreSize }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme, $size }) => theme.typography.size[SIZE_MAP[$size].baseFont]};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
