"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type {
  AlertQuickFilter,
  AlertQuickFilterKey,
  AlertSummaryBreakdown,
  SnoozedAlertsSummary,
} from "@/data/alerts/alerts.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { AlertQuickFiltersCard } from "./AlertQuickFiltersCard";
import { AlertSummaryChartCard } from "./AlertSummaryChartCard";
import { SnoozedAlertsCard } from "./SnoozedAlertsCard";

type AlertsRightSidebarProps = {
  breakdown: AlertSummaryBreakdown[];
  quickFilters: AlertQuickFilter[];
  snoozedSummary: SnoozedAlertsSummary;
  activeFilterKey: AlertQuickFilterKey | null;
  locale: string;
  onFilterClick: (key: AlertQuickFilterKey) => void;
  onClearFilters: () => void;
  onViewSnoozed: () => void;
};

export const AlertsRightSidebar = ({
  breakdown,
  quickFilters,
  snoozedSummary,
  activeFilterKey,
  locale,
  onFilterClick,
  onClearFilters,
  onViewSnoozed,
}: AlertsRightSidebarProps) => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <Aside>
      <motion.div {...reveal(0)}>
        <AlertSummaryChartCard breakdown={breakdown} locale={locale} />
      </motion.div>
      <motion.div {...reveal(1)}>
        <AlertQuickFiltersCard
          filters={quickFilters}
          activeFilterKey={activeFilterKey}
          onFilterClick={onFilterClick}
          onClearFilters={onClearFilters}
        />
      </motion.div>
      <motion.div {...reveal(2)}>
        <SnoozedAlertsCard summary={snoozedSummary} onViewSnoozed={onViewSnoozed} />
      </motion.div>
    </Aside>
  );
};

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;
