"use client";

import {
  AlignVerticalSpaceAround,
  LayoutGrid,
  Monitor,
  Moon,
  Palette,
  Radius,
  Rows3,
  Sun,
  Wind,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import styled from "styled-components";
import { matchesSettingsSearch } from "@/utils/settings/matchesSettingsSearch";
import {
  layoutDensityOptions,
  motionPreferenceOptions,
  themeOptions,
} from "@/data/settings/settings.mock";
import type {
  AppearanceSettingsState,
  LayoutDensityOption,
  MotionPreferenceOption,
  ThemeOption,
} from "@/data/settings/settings.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
  staggerContainerVariants,
} from "@/utils/motion/transitions";
import { AppearanceChartAnimationsCard } from "./AppearanceChartAnimationsCard";
import { AppearancePreviewPanel } from "./AppearancePreviewPanel";
import { SettingsCard } from "./SettingsCard";
import { SettingsOptionCard } from "./SettingsOptionCard";
import { SettingsSelectField } from "./SettingsSelectField";
import { SettingsSliderField } from "./SettingsSliderField";

type AppearanceSettingsTabProps = {
  draft: AppearanceSettingsState;
  onChange: (next: AppearanceSettingsState) => void;
  searchQuery?: string;
};

const themeIcons: Record<ThemeOption, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const densityIcons: Record<LayoutDensityOption, typeof AlignVerticalSpaceAround> = {
  comfortable: AlignVerticalSpaceAround,
  compact: Rows3,
};

export const AppearanceSettingsTab = ({
  draft,
  onChange,
  searchQuery = "",
}: AppearanceSettingsTabProps) => {
  const t = useTranslations("settings.appearance");
  const tSearch = useTranslations("settings.search");
  const prefersReducedMotion = useReducedMotion();

  const sectionMatches = useMemo(
    () => ({
      theme: matchesSettingsSearch(searchQuery, [t("theme.title"), t("theme.description")]),
      backgroundGlow: matchesSettingsSearch(searchQuery, [
        t("backgroundGlow.title"),
        t("backgroundGlow.description"),
      ]),
      layoutDensity: matchesSettingsSearch(searchQuery, [
        t("layoutDensity.title"),
        t("layoutDensity.description"),
      ]),
      chartAnimations: matchesSettingsSearch(searchQuery, [
        t("chartAnimations.title"),
        t("chartAnimations.description"),
      ]),
      cardRadius: matchesSettingsSearch(searchQuery, [
        t("cardRadius.title"),
        t("cardRadius.description"),
      ]),
      motionPreference: matchesSettingsSearch(searchQuery, [
        t("motionPreference.title"),
        t("motionPreference.description"),
      ]),
      preview: matchesSettingsSearch(searchQuery, [t("preview.title"), t("preview.subtitle")]),
    }),
    [searchQuery, t],
  );

  const hasVisibleSection = Object.values(sectionMatches).some(Boolean);

  const updateDraft = <K extends keyof AppearanceSettingsState>(
    key: K,
    value: AppearanceSettingsState[K],
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
      <ControlsColumn
        initial={prefersReducedMotion ? false : "hidden"}
        animate="show"
        variants={staggerContainerVariants(0.08, 0.02)}
      >
        {sectionMatches.theme ? (
        <MotionCard {...reveal(0)}>
          <SettingsCard
            icon={Palette}
            title={t("theme.title")}
            description={t("theme.description")}
          >
            <ThemeGrid>
              {themeOptions.map((option) => {
                const Icon = themeIcons[option];

                return (
                  <SettingsOptionCard
                    key={option}
                    icon={Icon}
                    iconAccent="primary"
                    title={t(`theme.${option}`)}
                    selected={draft.theme === option}
                    onSelect={() => updateDraft("theme", option)}
                  />
                );
              })}
            </ThemeGrid>
          </SettingsCard>
        </MotionCard>
        ) : null}

        {sectionMatches.backgroundGlow ? (
        <MotionCard {...reveal(1)}>
          <SettingsCard
            icon={Sun}
            title={t("backgroundGlow.title")}
            description={t("backgroundGlow.description")}
          >
            <SettingsSliderField
              id="settings-background-glow"
              label={t("backgroundGlow.title")}
              icon={Sun}
              min={0}
              max={100}
              step={5}
              value={draft.backgroundGlow}
              valueLabel={`${draft.backgroundGlow}%`}
              onChange={(value) => updateDraft("backgroundGlow", value)}
            />
          </SettingsCard>
        </MotionCard>
        ) : null}

        {sectionMatches.layoutDensity ? (
        <MotionCard {...reveal(2)}>
          <SettingsCard
            icon={LayoutGrid}
            title={t("layoutDensity.title")}
            description={t("layoutDensity.description")}
          >
            <DensityGrid>
              {layoutDensityOptions.map((option) => {
                const Icon = densityIcons[option];

                return (
                  <SettingsOptionCard
                    key={option}
                    icon={Icon}
                    iconAccent="primary"
                    title={t(`layoutDensity.${option}`)}
                    subtitle={t(`layoutDensity.${option}Description`)}
                    selected={draft.layoutDensity === option}
                    onSelect={() =>
                      updateDraft("layoutDensity", option as LayoutDensityOption)
                    }
                  />
                );
              })}
            </DensityGrid>
          </SettingsCard>
        </MotionCard>
        ) : null}

        {sectionMatches.chartAnimations ? (
        <MotionCard {...reveal(3)}>
          <AppearanceChartAnimationsCard
            checked={draft.chartAnimations}
            onChange={(checked) => updateDraft("chartAnimations", checked)}
          />
        </MotionCard>
        ) : null}

        {sectionMatches.cardRadius ? (
        <MotionCard {...reveal(4)}>
          <SettingsCard
            icon={Radius}
            title={t("cardRadius.title")}
            description={t("cardRadius.description")}
          >
            <SettingsSliderField
              id="settings-card-radius"
              label={t("cardRadius.title")}
              icon={Radius}
              min={4}
              max={24}
              step={1}
              value={draft.cardRadius}
              valueLabel={`${draft.cardRadius}px`}
              onChange={(value) => updateDraft("cardRadius", value)}
            />
          </SettingsCard>
        </MotionCard>
        ) : null}

        {sectionMatches.motionPreference ? (
        <MotionCard {...reveal(5)}>
          <SettingsCard
            icon={Wind}
            title={t("motionPreference.title")}
            description={t("motionPreference.description")}
          >
            <SettingsSelectField
              id="settings-motion-preference"
              label={t("motionPreference.title")}
              value={draft.motionPreference}
              onChange={(value) =>
                updateDraft("motionPreference", value as MotionPreferenceOption)
              }
            >
              {motionPreferenceOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`motionPreference.${option}`)}
                </option>
              ))}
            </SettingsSelectField>
          </SettingsCard>
        </MotionCard>
        ) : null}
      </ControlsColumn>

      {sectionMatches.preview ? (
        <AppearancePreviewPanel settings={draft} revealIndex={6} />
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
  grid-template-columns: minmax(0, 1.2fr) minmax(22rem, 32rem);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const ControlsColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MotionCard = styled(motion.div)`
  min-inline-size: 0;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const DensityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;
