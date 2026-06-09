"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { AlertSummaryMetric } from "@/data/alerts/alerts.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { AlertSummaryCard } from "./AlertSummaryCard";

type AlertsSummaryGridProps = {
  metrics: AlertSummaryMetric[];
  locale: string;
  startIndex?: number;
};

export const AlertsSummaryGrid = ({
  metrics,
  locale,
  startIndex = 0,
}: AlertsSummaryGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Grid>
      {metrics.map((metric, index) => (
        <MetricSlot
          key={metric.kind}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="show"
          variants={fadeUpVariants}
          transition={getCardRevealTransition(
            startIndex + index,
            prefersReducedMotion,
          )}
        >
          <AlertSummaryCard
            metric={metric}
            locale={locale}
            cardIndex={index}
          />
        </MetricSlot>
      ))}
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop + 191}px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));

    > * {
      grid-column: span 2;
    }

    > *:nth-last-child(2):nth-child(4),
    > *:last-child:nth-child(5) {
      grid-column: span 3;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > * {
      grid-column: auto;
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const MetricSlot = styled(motion.div)`
  min-inline-size: 0;
  display: flex;

  > article {
    flex: 1;
    min-inline-size: 0;
  }
`;
