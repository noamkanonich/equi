"use client";

import {
  Calendar,
  CircleDollarSign,
  Globe,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import styled from "styled-components";
import { matchesSettingsSearch } from "@/utils/settings/matchesSettingsSearch";
import {
  benchmarkOptions,
  currencyOptions,
  dateFormatOptions,
  languageOptions,
  marketRegionOptions,
} from "@/data/settings/settings.mock";
import { getBenchmarkSubtitleKey } from "@/data/settings/mappers";
import type {
  AiPreferencesState,
  AlertSettingsState,
  BenchmarkOption,
  DateFormatOption,
  GeneralSettingsState,
  MarketRegionOption,
  PortfolioSettingsState,
  ScoringModelSettingsState,
  SettingsQuickActionsFeedback,
  SettingsTabKey,
} from "@/data/settings/settings.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import { mapCurrencyCodeToTranslationKey } from "@/data/currencies/mappers";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
  staggerContainerVariants,
} from "@/utils/motion/transitions";
import { BenchmarkOptionCard } from "./BenchmarkOptionCard";
import { PrivacyNoticeCard } from "./PrivacyNoticeCard";
import { SettingsCard } from "./SettingsCard";
import { SettingsSelectField } from "./SettingsSelectField";
import { SettingsQuickActionsCard } from "./SettingsQuickActionsCard";
import { SettingsSummaryCard } from "./SettingsSummaryCard";

type GeneralSettingsTabProps = {
  draft: GeneralSettingsState;
  onChange: (next: GeneralSettingsState) => void;
  onExportSettings: () => void;
  onImportSettingsFile: (file: File) => void;
  quickActionsFeedback: SettingsQuickActionsFeedback;
  searchQuery?: string;
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
  onNavigateTab: (tab: SettingsTabKey) => void;
};

export const GeneralSettingsTab = ({
  draft,
  onChange,
  onExportSettings,
  onImportSettingsFile,
  quickActionsFeedback,
  searchQuery = "",
  portfolio,
  scoringModel,
  alerts,
  aiPreferences,
  onNavigateTab,
}: GeneralSettingsTabProps) => {
  const t = useTranslations("settings.general");
  const tPrivacy = useTranslations("settings.general.privacy");
  const tQuick = useTranslations("settings.quickActions");
  const tSummary = useTranslations("settings.summary");
  const tSearch = useTranslations("settings.search");
  const prefersReducedMotion = useReducedMotion();

  const sectionMatches = useMemo(
    () => ({
      language: matchesSettingsSearch(searchQuery, [
        t("language.title"),
        t("language.description"),
      ]),
      currency: matchesSettingsSearch(searchQuery, [
        t("currency.title"),
        t("currency.description"),
      ]),
      region: matchesSettingsSearch(searchQuery, [
        t("region.title"),
        t("region.description"),
      ]),
      dateFormat: matchesSettingsSearch(searchQuery, [
        t("dateFormat.title"),
        t("dateFormat.description"),
      ]),
      benchmark: matchesSettingsSearch(searchQuery, [
        t("benchmark.title"),
        t("benchmark.description"),
      ]),
      privacy: matchesSettingsSearch(searchQuery, [
        tPrivacy("title"),
        tPrivacy("description"),
      ]),
      summary: matchesSettingsSearch(searchQuery, [
        tSummary("title"),
        tSummary("subtitle"),
      ]),
      quickActions: matchesSettingsSearch(searchQuery, [
        tQuick("title"),
        tQuick("exportSettings"),
        tQuick("importSettings"),
      ]),
    }),
    [searchQuery, t, tPrivacy, tQuick, tSummary],
  );

  const hasVisibleMainSection =
    sectionMatches.language ||
    sectionMatches.currency ||
    sectionMatches.region ||
    sectionMatches.dateFormat ||
    sectionMatches.benchmark ||
    sectionMatches.privacy;

  const hasVisibleSidebarSection = sectionMatches.summary || sectionMatches.quickActions;

  const hasVisibleSection = hasVisibleMainSection || hasVisibleSidebarSection;

  const updateDraft = <K extends keyof GeneralSettingsState>(
    key: K,
    value: GeneralSettingsState[K],
  ) => {
    onChange({ ...draft, [key]: value });
  };

  const reveal = (index: number) => ({
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  if (!hasVisibleSection && searchQuery.trim()) {
    return <SearchEmpty>{tSearch("noResults")}</SearchEmpty>;
  }

  return (
    <Layout>
      <MainColumn
        initial={prefersReducedMotion ? false : "hidden"}
        animate="show"
        variants={staggerContainerVariants(0.08, 0.02)}
      >
        {hasVisibleMainSection ? (
        <CardsGrid>
          {sectionMatches.language ? (
          <MotionCard {...reveal(0)}>
            <SettingsCard
              icon={Globe}
              title={t("language.title")}
              description={t("language.description")}
            >
              <SettingsSelectField
                id="settings-language"
                label={t("language.title")}
                value={draft.language}
                onChange={(value) =>
                  updateDraft("language", value as SupportedLocale)
                }
              >
                {languageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "he" ? t("language.hebrew") : t("language.english")}
                  </option>
                ))}
              </SettingsSelectField>
            </SettingsCard>
          </MotionCard>
          ) : null}

          {sectionMatches.currency ? (
          <MotionCard {...reveal(1)}>
            <SettingsCard
              icon={CircleDollarSign}
              title={t("currency.title")}
              description={t("currency.description")}
            >
              <SettingsSelectField
                id="settings-currency"
                label={t("currency.title")}
                value={draft.displayCurrency}
                onChange={(value) =>
                  updateDraft("displayCurrency", value as CurrencyCode)
                }
                helperText={t("currency.helper", { currency: draft.displayCurrency })}
              >
                {currencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`currency.${mapCurrencyCodeToTranslationKey(option)}`)}
                  </option>
                ))}
              </SettingsSelectField>
            </SettingsCard>
          </MotionCard>
          ) : null}

          {sectionMatches.region ? (
          <MotionCard {...reveal(2)}>
            <SettingsCard
              icon={MapPin}
              title={t("region.title")}
              description={t("region.description")}
            >
              <SettingsSelectField
                id="settings-region"
                label={t("region.title")}
                value={draft.marketRegion}
                onChange={(value) =>
                  updateDraft("marketRegion", value as MarketRegionOption)
                }
                helperText={t("region.helper")}
              >
                {marketRegionOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`region.${option}`)}
                  </option>
                ))}
              </SettingsSelectField>
            </SettingsCard>
          </MotionCard>
          ) : null}

          {sectionMatches.dateFormat ? (
          <MotionCard {...reveal(3)}>
            <SettingsCard
              icon={Calendar}
              title={t("dateFormat.title")}
              description={t("dateFormat.description")}
            >
              <SettingsSelectField
                id="settings-date-format"
                label={t("dateFormat.title")}
                value={draft.dateFormat}
                onChange={(value) =>
                  updateDraft("dateFormat", value as DateFormatOption)
                }
                helperText={t("dateFormat.helper")}
              >
                {dateFormatOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(`dateFormat.${option}`)}
                  </option>
                ))}
              </SettingsSelectField>
            </SettingsCard>
          </MotionCard>
          ) : null}
        </CardsGrid>
        ) : null}

        {sectionMatches.benchmark ? (
        <MotionCard {...reveal(4)}>
          <SettingsCard
            icon={TrendingUp}
            title={t("benchmark.title")}
            description={t("benchmark.description")}
          >
            <BenchmarkGrid>
              {benchmarkOptions.map((option) => (
                <BenchmarkOptionCard
                  key={option}
                  title={t(`benchmark.${option}` as "benchmark.sp500")}
                  subtitle={t(
                    `benchmark.${getBenchmarkSubtitleKey(option)}` as "benchmark.standard",
                  )}
                  selected={draft.benchmark === option}
                  onSelect={() => updateDraft("benchmark", option as BenchmarkOption)}
                />
              ))}
            </BenchmarkGrid>
          </SettingsCard>
        </MotionCard>
        ) : null}

        {sectionMatches.privacy ? (
        <MotionCard {...reveal(5)}>
          <PrivacyNoticeCard />
        </MotionCard>
        ) : null}
      </MainColumn>

      {hasVisibleSidebarSection ? (
      <SidebarColumn
        initial={prefersReducedMotion ? false : "hidden"}
        animate="show"
        variants={staggerContainerVariants(0.08, 0.12)}
      >
        {sectionMatches.summary ? (
        <MotionCard {...reveal(0)}>
          <SettingsSummaryCard
            portfolio={portfolio}
            scoringModel={scoringModel}
            alerts={alerts}
            aiPreferences={aiPreferences}
            onNavigateTab={onNavigateTab}
          />
        </MotionCard>
        ) : null}
        {sectionMatches.quickActions ? (
        <MotionCard {...reveal(1)}>
          <SettingsQuickActionsCard
            onExportSettings={onExportSettings}
            onImportSettingsFile={onImportSettingsFile}
            exportStatus={quickActionsFeedback.exportStatus}
            importStatus={quickActionsFeedback.importStatus}
            importErrorReason={quickActionsFeedback.importErrorReason}
          />
        </MotionCard>
        ) : null}
      </SidebarColumn>
      ) : null}
    </Layout>
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

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(20rem, 23.75rem);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MotionCard = styled(motion.div)`
  min-inline-size: 0;
`;

const BenchmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SidebarColumn = styled(motion.aside)`
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
