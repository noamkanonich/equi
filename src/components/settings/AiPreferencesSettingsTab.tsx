"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import styled from "styled-components";
import type { AiPreferencesState } from "@/data/settings/settings.types";
import { matchesSettingsSearch } from "@/utils/settings/matchesSettingsSearch";
import { resetAiPreferences } from "@/utils/settings/resetAiPreferences";
import { AiConfidenceScoresModal } from "./AiConfidenceScoresModal";
import { AiPreferencesBehaviorCard } from "./AiPreferencesLearningCard";
import { AiPreferencesDetailLevelCard } from "./AiPreferencesDetailLevelCard";
import { AiPreferencesExplanationStructureCard } from "./AiPreferencesDataSourcesCard";
import { AiPreferencesResponsePreviewCard } from "./AiPreferencesConfidencePreviewCard";
import { AiPreferencesQuickActionsCard } from "./AiPreferencesQuickActionsCard";
import { AiPreferencesRiskVisibilityCard } from "./AiPreferencesFeatureTogglesCard";
import { AiPreferencesSettingsHeaderCard } from "./AiPreferencesSettingsHeaderCard";
import { AiPreferencesSummaryCard } from "./AiPreferencesSummaryCard";
import { AiPreferencesToneCard } from "./AiPreferencesToneCard";
import { AiResponsePreviewModal } from "./AiResponsePreviewModal";
import { AiSafetyNoticeCard } from "./AiSafetyNoticeCard";
import { AiSafetyRulesModal } from "./AiSafetyRulesModal";

type AiModalKey = "preview" | "safetyRules" | "confidenceScores" | null;

type AiPreferencesSettingsTabProps = {
  draft: AiPreferencesState;
  onChange: (next: AiPreferencesState) => void;
  searchQuery?: string;
};

export const AiPreferencesSettingsTab = ({
  draft,
  onChange,
  searchQuery = "",
}: AiPreferencesSettingsTabProps) => {
  const t = useTranslations("settings.aiPreferences");
  const tQuick = useTranslations("settings.aiPreferences.quickActions");
  const tSearch = useTranslations("settings.search");
  const [activeModal, setActiveModal] = useState<AiModalKey>(null);

  const sectionMatches = useMemo(
    () => ({
      header: matchesSettingsSearch(searchQuery, [
        t("header.title"),
        t("header.description"),
      ]),
      detailLevel: matchesSettingsSearch(searchQuery, [
        t("detail.title"),
        t("detail.description"),
      ]),
      tone: matchesSettingsSearch(searchQuery, [t("tone.title"), t("tone.description")]),
      riskVisibility: matchesSettingsSearch(searchQuery, [
        t("risk.title"),
        t("risk.description"),
      ]),
      explanation: matchesSettingsSearch(searchQuery, [
        t("structure.title"),
        t("structure.description"),
      ]),
      behavior: matchesSettingsSearch(searchQuery, [
        t("behavior.title"),
        t("behavior.description"),
      ]),
      safety: matchesSettingsSearch(searchQuery, [
        t("safety.title"),
        t("safety.description"),
      ]),
      summary: matchesSettingsSearch(searchQuery, [
        t("summary.title"),
        t("summary.subtitle"),
      ]),
      responsePreview: matchesSettingsSearch(searchQuery, [
        t("preview.title"),
        t("preview.subtitle"),
      ]),
      quickActions: matchesSettingsSearch(searchQuery, [
        tQuick("title"),
        tQuick("resetAiPreferences"),
      ]),
    }),
    [searchQuery, t, tQuick],
  );

  const hasVisibleSection = Object.values(sectionMatches).some(Boolean);

  const openPreview = () => setActiveModal("preview");
  const openSafetyRules = () => setActiveModal("safetyRules");
  const openConfidenceScores = () => setActiveModal("confidenceScores");
  const closeModal = () => setActiveModal(null);

  const handleReset = () => {
    onChange(resetAiPreferences());
  };

  if (!hasVisibleSection && searchQuery.trim()) {
    return <SearchEmpty>{tSearch("noResults")}</SearchEmpty>;
  }

  return (
    <>
      <Layout>
        <MainColumn>
          {sectionMatches.header ? (
            <AiPreferencesSettingsHeaderCard onPreview={openPreview} />
          ) : null}
          {sectionMatches.detailLevel ? (
            <AiPreferencesDetailLevelCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.tone ? (
            <AiPreferencesToneCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.riskVisibility ? (
            <AiPreferencesRiskVisibilityCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.explanation ? (
            <AiPreferencesExplanationStructureCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.behavior ? (
            <AiPreferencesBehaviorCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.safety ? <AiSafetyNoticeCard /> : null}
        </MainColumn>

        <SidebarColumn>
          {sectionMatches.summary ? <AiPreferencesSummaryCard settings={draft} /> : null}
          {sectionMatches.responsePreview ? (
            <AiPreferencesResponsePreviewCard settings={draft} />
          ) : null}
          {sectionMatches.quickActions ? (
            <AiPreferencesQuickActionsCard
              onReset={handleReset}
              onPreview={openPreview}
              onSafetyRules={openSafetyRules}
              onConfidenceScores={openConfidenceScores}
            />
          ) : null}
        </SidebarColumn>
      </Layout>

      <AiResponsePreviewModal
        isOpen={activeModal === "preview"}
        onClose={closeModal}
        settings={draft}
      />
      <AiSafetyRulesModal
        isOpen={activeModal === "safetyRules"}
        onClose={closeModal}
      />
      <AiConfidenceScoresModal
        isOpen={activeModal === "confidenceScores"}
        onClose={closeModal}
      />
    </>
  );
};

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

const SearchEmpty = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
