"use client";

import { Scale, Shield, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { aiToneOptions } from "@/data/settings/settings.mock";
import type { AiPreferencesState, AiTone } from "@/data/settings/settings.types";
import type { SettingsOptionAccent } from "./SettingsOptionCard";
import { SettingsCard } from "./SettingsCard";
import { SettingsInfoBox } from "./SettingsInfoBox";
import { SettingsOptionCard } from "./SettingsOptionCard";

type AiPreferencesToneCardProps = {
  draft: AiPreferencesState;
  onChange: (next: AiPreferencesState) => void;
};

const toneIcons = {
  conservative: Shield,
  balanced: Scale,
  growthOriented: TrendingUp,
} as const;

const toneAccents: Record<AiTone, SettingsOptionAccent> = {
  conservative: "positive",
  balanced: "primary",
  growthOriented: "purple",
};

export const AiPreferencesToneCard = ({ draft, onChange }: AiPreferencesToneCardProps) => {
  const t = useTranslations("settings.aiPreferences.tone");
  const tSummary = useTranslations("settings.summary");

  const updateTone = (tone: AiTone) => {
    onChange({ ...draft, tone });
  };

  return (
    <SettingsCard icon={Scale} title={t("title")} description={t("description")}>
      <OptionGrid>
        {aiToneOptions.map((option) => {
          const Icon = toneIcons[option];
          const isBalanced = option === "balanced";

          return (
            <SettingsOptionCard
              key={option}
              icon={Icon}
              iconAccent={toneAccents[option]}
              title={t(option)}
              subtitle={t(`${option}Subtitle`)}
              badgeLabel={isBalanced ? tSummary("recommended") : undefined}
              selected={draft.tone === option}
              onSelect={() => updateTone(option)}
            />
          );
        })}
      </OptionGrid>
      <SettingsInfoBox variant="info" icon={Scale}>
        {t(`info.${draft.tone}` as "info.balanced")}
      </SettingsInfoBox>
    </SettingsCard>
  );
};

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;
