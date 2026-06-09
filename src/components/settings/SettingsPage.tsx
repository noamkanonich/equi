"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { PageContent } from "@/components/layout/PageContent";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import {
  defaultPortfolioSettings,
  defaultScoringModelSettings,
} from "@/data/settings/settings.mock";
import type {
  AiPreferencesState,
  AlertSettingsState,
  AppearanceSettingsState,
  GeneralSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
  SettingsQuickActionsFeedback,
  SettingsTabKey,
} from "@/data/settings/settings.types";
import { usePathname, useRouter } from "@/i18n/routing";
import { isSupabaseConfigured } from "@/lib/supabase/supabase";
import { useAppStore } from "@/store/app.store";
import {
  buildEquiUserSettingsSnapshot,
  getCachedUserId,
  persistUserSettingsToSupabase,
} from "@/utils/user-data/userDataSync";
import { applyAiPreferencesSettings } from "@/utils/settings/applyAiPreferencesSettings";
import { resetAiPreferences } from "@/utils/settings/resetAiPreferences";
import { applyAlertSettings } from "@/utils/settings/applyAlertSettings";
import { applyPortfolioSettings } from "@/utils/settings/applyPortfolioSettings";
import { applyScoringModelSettings } from "@/utils/settings/applyScoringModelSettings";
import { hasAtLeastOnePriorityEnabled } from "@/utils/settings/validateAlertPriorities";
import { validateScoringWeights } from "@/utils/settings/validateScoringWeights";
import {
  applyAppearanceSettings,
  resetAppearanceSettings,
} from "@/utils/settings/resetAppearanceSettings";
import { applyGeneralSettings } from "@/utils/settings/applyGeneralSettings";
import { applyImportedSettings } from "@/utils/settings/applyImportedSettings";
import { buildSettingsExportSnapshot } from "@/utils/settings/buildSettingsExportSnapshot";
import { exportSettingsToFile } from "@/utils/settings/exportSettingsToFile";
import { resetAlertsSettings } from "@/utils/settings/resetAlertsSettings";
import { resetGeneralSettings } from "@/utils/settings/resetGeneralSettings";
import { validateImportedSettings } from "@/utils/settings/validateImportedSettings";
import {
  buildAiPreferencesFromStore,
  buildAlertSettingsFromStore,
  buildAppearanceSettingsFromStore,
  buildGeneralSettingsFromStore,
  buildPortfolioSettingsFromStore,
  buildScoringModelSettingsFromStore,
} from "@/utils/settings/mappers";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { AiPreferencesSettingsTab } from "./AiPreferencesSettingsTab";
import { AlertsSettingsTab } from "./AlertsSettingsTab";
import { AppearanceSettingsTab } from "./AppearanceSettingsTab";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { PortfolioSettingsTab } from "./PortfolioSettingsTab";
import { ScoringModelSettingsTab } from "./ScoringModelSettingsTab";
import { SettingsComingSoon } from "./SettingsComingSoon";
import { SettingsFooterActions } from "./SettingsFooterActions";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsTabs } from "./SettingsTabs";

const tabsWithForm: SettingsTabKey[] = [
  "general",
  "appearance",
  "portfolio",
  "scoringModel",
  "alerts",
  "aiPreferences",
];

const isSettingsTabKey = (value: string | null): value is SettingsTabKey =>
  tabsWithForm.includes(value as SettingsTabKey) ||
  value === "aiPreferences" ||
  value === "integrations";

export const SettingsPage = () => {
  const locale = useLocale() as SupportedLocale;
  const tScoringModel = useTranslations("settings.scoringModel");
  const tAlerts = useTranslations("settings.alerts");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const setDisplayCurrency = useAppStore((state) => state.setDisplayCurrency);

  const tabParam = searchParams.get("tab");
  const activeTab: SettingsTabKey = isSettingsTabKey(tabParam) ? tabParam : "general";
  const [generalDraft, setGeneralDraft] = useState<GeneralSettingsState>(() =>
    buildGeneralSettingsFromStore(locale, displayCurrency),
  );
  const [generalSaved, setGeneralSaved] = useState<GeneralSettingsState>(() =>
    buildGeneralSettingsFromStore(locale, displayCurrency),
  );
  const [appearanceDraft, setAppearanceDraft] = useState<AppearanceSettingsState>(
    () => buildAppearanceSettingsFromStore(),
  );
  const [appearanceSaved, setAppearanceSaved] = useState<AppearanceSettingsState>(
    () => buildAppearanceSettingsFromStore(),
  );
  const [portfolioDraft, setPortfolioDraft] = useState<PortfolioSettingsState>(() =>
    buildPortfolioSettingsFromStore(),
  );
  const [portfolioSaved, setPortfolioSaved] = useState<PortfolioSettingsState>(() =>
    buildPortfolioSettingsFromStore(),
  );
  const [scoringDraft, setScoringDraft] = useState<ScoringModelSettingsState>(() =>
    buildScoringModelSettingsFromStore(),
  );
  const [scoringSaved, setScoringSaved] = useState<ScoringModelSettingsState>(() =>
    buildScoringModelSettingsFromStore(),
  );
  const [alertsDraft, setAlertsDraft] = useState<AlertSettingsState>(() =>
    buildAlertSettingsFromStore(),
  );
  const [alertsSaved, setAlertsSaved] = useState<AlertSettingsState>(() =>
    buildAlertSettingsFromStore(),
  );
  const [aiPreferencesDraft, setAiPreferencesDraft] = useState<AiPreferencesState>(() =>
    buildAiPreferencesFromStore(),
  );
  const [aiPreferencesSaved, setAiPreferencesSaved] = useState<AiPreferencesState>(() =>
    buildAiPreferencesFromStore(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [quickActionsFeedback, setQuickActionsFeedback] =
    useState<SettingsQuickActionsFeedback>({
      exportStatus: "idle",
      importStatus: "idle",
    });

  useEffect(() => {
    if (saveStatus !== "saved") return;

    const timer = window.setTimeout(() => {
      setSaveStatus("idle");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    const hasFeedback =
      quickActionsFeedback.exportStatus === "success" ||
      quickActionsFeedback.importStatus === "success" ||
      quickActionsFeedback.importStatus === "error";

    if (!hasFeedback) return;

    const timer = window.setTimeout(() => {
      setQuickActionsFeedback({
        exportStatus: "idle",
        importStatus: "idle",
      });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [quickActionsFeedback]);

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  const switchLocale = useCallback(
    (nextLocale: SupportedLocale) => {
      if (nextLocale !== locale) {
        router.replace(pathname, { locale: nextLocale });
      }
    },
    [locale, pathname, router],
  );

  const handleTabChange = useCallback(
    (tab: SettingsTabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleResetToDefaults = () => {
    if (activeTab === "general") {
      setGeneralDraft(resetGeneralSettings(locale, displayCurrency));
      return;
    }

    if (activeTab === "appearance") {
      setAppearanceDraft(resetAppearanceSettings());
      return;
    }

    if (activeTab === "portfolio") {
      setPortfolioDraft({ ...defaultPortfolioSettings });
      return;
    }

    if (activeTab === "scoringModel") {
      setScoringDraft({ ...defaultScoringModelSettings });
      return;
    }

    if (activeTab === "alerts") {
      setAlertsDraft(resetAlertsSettings());
      return;
    }

    if (activeTab === "aiPreferences") {
      setAiPreferencesDraft(resetAiPreferences());
    }
  };

  const handleCancel = () => {
    if (activeTab === "general") {
      setGeneralDraft({ ...generalSaved });
      return;
    }

    if (activeTab === "appearance") {
      setAppearanceDraft({ ...appearanceSaved });
      return;
    }

    if (activeTab === "portfolio") {
      setPortfolioDraft({ ...portfolioSaved });
      return;
    }

    if (activeTab === "scoringModel") {
      setScoringDraft({ ...scoringSaved });
      return;
    }

    if (activeTab === "alerts") {
      setAlertsDraft({ ...alertsSaved });
      return;
    }

    if (activeTab === "aiPreferences") {
      setAiPreferencesDraft({ ...aiPreferencesSaved });
    }
  };

  const handleExportSettings = () => {
    const snapshot = buildSettingsExportSnapshot({
      general: generalDraft,
      appearance: appearanceDraft,
      portfolio: portfolioDraft,
      scoringModel: scoringDraft,
      alerts: alertsDraft,
      aiPreferences: aiPreferencesDraft,
    });

    exportSettingsToFile(snapshot);
    setQuickActionsFeedback({
      exportStatus: "success",
      importStatus: "idle",
    });
  };

  const handleImportSettingsFile = async (file: File) => {
    try {
      const rawText = await file.text();
      const result = validateImportedSettings(rawText);

      if (!result.ok) {
        setQuickActionsFeedback({
          exportStatus: "idle",
          importStatus: "error",
          importErrorReason: result.reason,
        });
        return;
      }

      const applied = applyImportedSettings({
        payload: result.payload,
        currentLocale: locale,
        currentCurrency: displayCurrency,
        setDisplayCurrency,
        switchLocale,
      });

      setGeneralDraft(applied.general);
      setGeneralSaved(applied.general);
      setAppearanceDraft(applied.appearance);
      setAppearanceSaved(applied.appearance);
      setPortfolioDraft(applied.portfolio);
      setPortfolioSaved(applied.portfolio);
      setScoringDraft(applied.scoringModel);
      setScoringSaved(applied.scoringModel);
      setAlertsDraft(applied.alerts);
      setAlertsSaved(applied.alerts);
      setAiPreferencesDraft(applied.aiPreferences);
      setAiPreferencesSaved(applied.aiPreferences);

      setQuickActionsFeedback({
        exportStatus: "idle",
        importStatus: "success",
      });
    } catch {
      setQuickActionsFeedback({
        exportStatus: "idle",
        importStatus: "error",
        importErrorReason: "invalidFormat",
      });
    }
  };

  const persistSettingsIfConfigured = () => {
    if (!isSupabaseConfigured || !getCachedUserId()) {
      return;
    }

    void persistUserSettingsToSupabase(buildEquiUserSettingsSnapshot());
  };

  const handleSave = () => {
    if (activeTab === "general") {
      const nextSnapshot = applyGeneralSettings({
        draft: generalDraft,
        currentLocale: locale,
        currentCurrency: displayCurrency,
        setDisplayCurrency,
        switchLocale,
      });

      setGeneralSaved(nextSnapshot);
      setGeneralDraft(nextSnapshot);
      setSaveStatus("saved");
      persistSettingsIfConfigured();
      return;
    }

    if (activeTab === "appearance") {
      const nextSnapshot = applyAppearanceSettings(appearanceDraft);
      setAppearanceSaved(nextSnapshot);
      setAppearanceDraft(nextSnapshot);
      setSaveStatus("saved");
      persistSettingsIfConfigured();
      return;
    }

    if (activeTab === "portfolio") {
      const nextSnapshot = applyPortfolioSettings(portfolioDraft);
      setPortfolioSaved(nextSnapshot);
      setPortfolioDraft(nextSnapshot);
      setSaveStatus("saved");
      persistSettingsIfConfigured();
      return;
    }

    if (activeTab === "scoringModel") {
      const { isValid } = validateScoringWeights(scoringDraft.weights);
      if (!isValid) return;

      const nextSnapshot = applyScoringModelSettings(scoringDraft);
      setScoringSaved(nextSnapshot);
      setScoringDraft(nextSnapshot);
      setSaveStatus("saved");
      persistSettingsIfConfigured();
      return;
    }

    if (activeTab === "alerts") {
      if (!hasAtLeastOnePriorityEnabled(alertsDraft)) return;

      const nextSnapshot = applyAlertSettings(alertsDraft);
      setAlertsSaved(nextSnapshot);
      setAlertsDraft(nextSnapshot);
      setSaveStatus("saved");
      persistSettingsIfConfigured();
      return;
    }

    if (activeTab === "aiPreferences") {
      const nextSnapshot = applyAiPreferencesSettings(aiPreferencesDraft);
      setAiPreferencesSaved(nextSnapshot);
      setAiPreferencesDraft(nextSnapshot);
      setSaveStatus("saved");
      persistSettingsIfConfigured();
    }
  };

  const scoringValidation = validateScoringWeights(scoringDraft.weights);
  const isScoringSaveDisabled =
    activeTab === "scoringModel" && !scoringValidation.isValid;
  const isAlertsSaveDisabled =
    activeTab === "alerts" && !hasAtLeastOnePriorityEnabled(alertsDraft);
  const isSaveDisabled = isScoringSaveDisabled || isAlertsSaveDisabled;
  const saveDisabledMessage = isScoringSaveDisabled
    ? tScoringModel("saveDisabledInvalidTotal")
    : isAlertsSaveDisabled
      ? tAlerts("saveDisabledNoPriority")
      : undefined;

  const renderTabContent = () => {
    if (activeTab === "general") {
      return (
        <GeneralSettingsTab
          draft={generalDraft}
          onChange={setGeneralDraft}
          onExportSettings={handleExportSettings}
          onImportSettingsFile={handleImportSettingsFile}
          quickActionsFeedback={quickActionsFeedback}
          searchQuery={searchQuery}
          portfolio={portfolioDraft}
          scoringModel={scoringDraft}
          alerts={alertsDraft}
          aiPreferences={aiPreferencesDraft}
          onNavigateTab={handleTabChange}
        />
      );
    }

    if (activeTab === "appearance") {
      return (
        <AppearanceSettingsTab
          draft={appearanceDraft}
          onChange={setAppearanceDraft}
          searchQuery={searchQuery}
        />
      );
    }

    if (activeTab === "portfolio") {
      return (
        <PortfolioSettingsTab
          draft={portfolioDraft}
          onChange={setPortfolioDraft}
          searchQuery={searchQuery}
        />
      );
    }

    if (activeTab === "scoringModel") {
      return (
        <ScoringModelSettingsTab
          draft={scoringDraft}
          onChange={setScoringDraft}
          searchQuery={searchQuery}
        />
      );
    }

    if (activeTab === "alerts") {
      return (
        <AlertsSettingsTab
          draft={alertsDraft}
          onChange={setAlertsDraft}
          searchQuery={searchQuery}
        />
      );
    }

    if (activeTab === "aiPreferences") {
      return (
        <AiPreferencesSettingsTab
          draft={aiPreferencesDraft}
          onChange={setAiPreferencesDraft}
          searchQuery={searchQuery}
        />
      );
    }

    return <SettingsComingSoon />;
  };

  return (
    <PageContent>
      <MotionSection {...reveal(0)}>
        <SettingsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetToDefaults={handleResetToDefaults}
        />
      </MotionSection>

      <MotionSection {...reveal(1)}>
        <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </MotionSection>

      <MotionSection {...reveal(2)}>{renderTabContent()}</MotionSection>

      {tabsWithForm.includes(activeTab) ? (
        <MotionSection {...reveal(3)}>
          <SettingsFooterActions
            saveStatus={saveStatus}
            onSave={handleSave}
            onCancel={handleCancel}
            saveDisabled={isSaveDisabled}
            saveDisabledMessage={saveDisabledMessage}
          />
        </MotionSection>
      ) : null}
    </PageContent>
  );
};

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;
