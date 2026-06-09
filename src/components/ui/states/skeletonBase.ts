"use client";

import styled, { css, keyframes } from "styled-components";

export const skeletonPulse = keyframes`
  0% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.55;
  }
`;

export const skeletonAnimation = css`
  animation: ${skeletonPulse} 1.2s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.75;
  }
`;

export const SkeletonBlock = styled.span<{ $width?: string; $height?: string; $radius?: string }>`
  display: block;
  inline-size: ${({ $width }) => $width ?? "100%"};
  block-size: ${({ $height }) => $height ?? "0.75rem"};
  border-radius: ${({ $radius, theme }) => $radius ?? theme.radius.sm};
  background: ${({ theme }) => theme.colors.background.soft};
  ${skeletonAnimation}
`;

export const SkeletonCircle = styled.span<{ $size?: string }>`
  display: block;
  inline-size: ${({ $size }) => $size ?? "2rem"};
  block-size: ${({ $size }) => $size ?? "2rem"};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
  flex-shrink: 0;
  ${skeletonAnimation}
`;
