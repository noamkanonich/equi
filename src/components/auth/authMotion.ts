import { css, keyframes } from "styled-components";

export const pageFadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const cardReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const heroReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const floatSlow = keyframes`
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
`;

export const glowPulse = keyframes`
  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
`;

export const tabCrossfade = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const reducedMotionStyles = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
`;

export const authPageFadeIn = css`
  animation: ${pageFadeIn} 0.4s ease-out both;
  ${reducedMotionStyles}
`;

export const authCardReveal = (delay = "0.12s") => css`
  animation: ${cardReveal} 0.48s ease-out ${delay} both;
  ${reducedMotionStyles}
`;

export const authHeroReveal = (delay = "0s") => css`
  animation: ${heroReveal} 0.42s ease-out ${delay} both;
  ${reducedMotionStyles}
`;

export const authFloatSlow = (delay = "0s", duration = "6s") => css`
  animation: ${floatSlow} ${duration} ease-in-out ${delay} infinite;
  ${reducedMotionStyles}
`;

export const authGlowPulse = (delay = "0s") => css`
  animation: ${glowPulse} 4s ease-in-out ${delay} infinite;
  ${reducedMotionStyles}
`;

export const authTabCrossfade = css`
  animation: ${tabCrossfade} 0.2s ease-out both;
  ${reducedMotionStyles}
`;
