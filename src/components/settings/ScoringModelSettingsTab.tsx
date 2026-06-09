"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { matchesSettingsSearch } from "@/utils/settings/matchesSettingsSearch";
import { recommendedScoringWeights } from "@/data/scoring/scoring.mock";
import type { ScoringFactorKey } from "@/data/scoring/scoring.types";
import type { ScoringModelSettingsState } from "@/data/settings/settings.types";
import { areWeightsEqual } from "@/utils/scoring/normalizeFactorWeights";
import { fadeUpVariants, staggerContainerVariants } from "@/utils/motion/transitions";
import { updateScoringFactorWeight } from "@/utils/settings/updateScoringFactorWeight";
import { HowScoringWorksModal } from "./HowScoringWorksModal";
import { ScoringComparisonModal } from "./ScoringComparisonModal";
import { ScoringFactorDefinitionsModal } from "./ScoringFactorDefinitionsModal";
import { ScoringModelAboutCard } from "./ScoringModelAboutCard";
import { ScoringModelFactorsCard } from "./ScoringModelFactorsCard";
import { ScoringModelQuickActionsCard } from "./ScoringModelQuickActionsCard";
import { ScoringModelSummaryCard } from "./ScoringModelSummaryCard";

type ScoringModelSettingsTabProps = {
  draft: ScoringModelSettingsState;
  onChange: (next: ScoringModelSettingsState) => void;
  searchQuery?: string;
};

export const ScoringModelSettingsTab = ({
  draft,
  onChange,
  searchQuery = "",
}: ScoringModelSettingsTabProps) => {
  const t = useTranslations("settings.scoringModel");
  const tQuick = useTranslations("settings.scoringModel.quickActions");
  const tSummary = useTranslations("settings.scoringModel.summary");
  const tSearch = useTranslations("settings.search");
  const prefersReducedMotion = useReducedMotion();

  const sectionMatches = useMemo(
    () => ({
      factors: matchesSettingsSearch(searchQuery, [t("title"), t("description")]),
      about: matchesSettingsSearch(searchQuery, [t("about.title"), t("about.description")]),
      summary: matchesSettingsSearch(searchQuery, [tSummary("title"), tSummary("subtitle")]),
      quickActions: matchesSettingsSearch(searchQuery, [
        tQuick("title"),
        tQuick("compareRecommended"),
      ]),
    }),
    [searchQuery, t, tQuick, tSummary],
  );

  const hasVisibleSection = Object.values(sectionMatches).some(Boolean);
  const [expandedFactors, setExpandedFactors] = useState<Set<ScoringFactorKey>>(new Set());
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isDefinitionsOpen, setIsDefinitionsOpen] = useState(false);
  const [isHowScoringOpen, setIsHowScoringOpen] = useState(false);
  const [showSavedCustomFeedback, setShowSavedCustomFeedback] = useState(false);

  const updateWeights = useCallback(
    (key: ScoringFactorKey, weight: number) => {
      const nextWeights = updateScoringFactorWeight(draft.weights, key, weight);
      const isCustom = !areWeightsEqual(nextWeights, recommendedScoringWeights);

      onChange({
        weights: nextWeights,
        isCustomModel: isCustom || draft.isCustomModel,
      });
    },
    [draft.isCustomModel, draft.weights, onChange],
  );

  const applyRecommended = useCallback(() => {
    onChange({
      weights: { ...recommendedScoringWeights },
      isCustomModel: false,
    });
  }, [onChange]);

  const handleSaveCustomModel = useCallback(() => {
    onChange({
      ...draft,
      isCustomModel: true,
    });
    setShowSavedCustomFeedback(true);
  }, [draft, onChange]);

  useEffect(() => {
    if (!showSavedCustomFeedback) return;

    const timer = window.setTimeout(() => {
      setShowSavedCustomFeedback(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [showSavedCustomFeedback]);

  const handleToggleExpand = useCallback((key: ScoringFactorKey) => {
    setExpandedFactors((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const rowStagger = staggerContainerVariants(0.05, 0.02);

  if (!hasVisibleSection && searchQuery.trim()) {
    return <SearchEmpty>{tSearch("noResults")}</SearchEmpty>;
  }

  return (
    <TabRoot
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={fadeUpVariants}
      transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
    >
      <Layout>
        <MainColumn>
          {sectionMatches.factors ? (
          <ScoringModelFactorsCard
            weights={draft.weights}
            expandedFactors={expandedFactors}
            onToggleExpand={handleToggleExpand}
            onWeightChange={updateWeights}
            onUseRecommended={applyRecommended}
            rowMotionVariants={rowStagger}
            prefersReducedMotion={prefersReducedMotion}
          />
          ) : null}
          {sectionMatches.about ? <ScoringModelAboutCard /> : null}
        </MainColumn>

        <SidebarColumn>
          {sectionMatches.summary ? (
            <ScoringModelSummaryCard weights={draft.weights} />
          ) : null}
          {sectionMatches.quickActions ? (
          <ScoringModelQuickActionsCard
            onCompareRecommended={() => setIsCompareOpen(true)}
            onResetRecommended={applyRecommended}
            onSaveCustomModel={handleSaveCustomModel}
            onHowScoringWorks={() => setIsHowScoringOpen(true)}
            onViewFactorDefinitions={() => setIsDefinitionsOpen(true)}
            showSavedCustomFeedback={showSavedCustomFeedback}
          />
          ) : null}
        </SidebarColumn>
      </Layout>

      <ScoringComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentWeights={draft.weights}
      />
      <ScoringFactorDefinitionsModal
        isOpen={isDefinitionsOpen}
        onClose={() => setIsDefinitionsOpen(false)}
      />
      <HowScoringWorksModal
        isOpen={isHowScoringOpen}
        onClose={() => setIsHowScoringOpen(false)}
      />
    </TabRoot>
  );
};

const SearchEmpty = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const TabRoot = styled(motion.div)`
  min-inline-size: 0;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SidebarColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;
