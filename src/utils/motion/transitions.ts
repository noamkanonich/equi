import type { Transition, Variants } from "framer-motion";

export const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

export const softTransition = (
  duration = 0.38,
  delay = 0,
): Transition => ({
  duration,
  delay,
  ease: SOFT_EASE,
});

export const CARD_STAGGER_DELAY = 0.06;
export const CARD_REVEAL_DURATION = 0.32;

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export const getCardRevealTransition = (
  index: number,
  prefersReducedMotion: boolean | null,
) =>
  prefersReducedMotion
    ? { duration: 0 }
    : softTransition(CARD_REVEAL_DURATION, index * CARD_STAGGER_DELAY);

export const staggerContainerVariants = (
  stagger = 0.06,
  delayChildren = 0.03,
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const navItemVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

export const navStaggerVariants = staggerContainerVariants(0.045, 0.08);

export const overlayFadeTransition = (prefersReducedMotion: boolean | null) =>
  prefersReducedMotion ? { duration: 0 } : softTransition(0.28);
