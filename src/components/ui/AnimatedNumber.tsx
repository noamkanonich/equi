"use client";

import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SOFT_EASE } from "@/utils/motion/transitions";

type AnimatedNumberProps = {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
  delay?: number;
  decimals?: number;
  className?: string;
  replayKey?: string | number;
};

const DEFAULT_DURATION = 0.9;
const DEFAULT_FORMATTER = (value: number) => String(value);

const roundToDecimals = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export const AnimatedNumber = ({
  value,
  formatter = DEFAULT_FORMATTER,
  duration = DEFAULT_DURATION,
  delay = 0,
  decimals,
  className,
  replayKey,
}: AnimatedNumberProps) => {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const previousValue = useRef<number | null>(null);
  const previousReplayKey = useRef(replayKey);
  const formatterRef = useRef(formatter);

  useEffect(() => {
    formatterRef.current = formatter;
  }, [formatter]);

  const formatValue = (raw: number) => {
    const rounded =
      decimals !== undefined ? roundToDecimals(raw, decimals) : raw;
    return formatter(rounded);
  };

  const [display, setDisplay] = useState(() => formatValue(0));

  useEffect(() => {
    const applyFormatter = (raw: number) => {
      const rounded =
        decimals !== undefined ? roundToDecimals(raw, decimals) : raw;
      setDisplay(formatterRef.current(rounded));
    };

    if (replayKey !== previousReplayKey.current) {
      previousValue.current = null;
      previousReplayKey.current = replayKey;
    }

    if (prefersReducedMotion) {
      motionValue.set(value);
      previousValue.current = value;
      applyFormatter(value);
      return;
    }

    const from = previousValue.current ?? 0;
    previousValue.current = value;
    motionValue.set(from);
    applyFormatter(from);

    const controls = animate(motionValue, value, {
      duration,
      delay: delay / 1000,
      ease: SOFT_EASE,
      onUpdate: (latest) => applyFormatter(latest),
    });

    return () => controls.stop();
  }, [
    value,
    duration,
    delay,
    decimals,
    prefersReducedMotion,
    motionValue,
    replayKey,
  ]);

  return <Text className={className}>{display}</Text>;
};

const Text = styled.span`
  white-space: nowrap;
`;
