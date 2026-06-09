"use client";

import { AlignLeft, FileText, List } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { aiDetailLevelOptions } from "@/data/settings/settings.mock";
import type {
  AiDetailLevelOption,
  AiPreferencesState,
} from "@/data/settings/settings.types";
import type { SettingsOptionAccent } from "./SettingsOptionCard";
import { SettingsCard } from "./SettingsCard";
import { SettingsInfoBox } from "./SettingsInfoBox";
import { SettingsOptionCard } from "./SettingsOptionCard";

type AiPreferencesDetailLevelCardProps = {
  draft: AiPreferencesState;
  onChange: (next: AiPreferencesState) => void;
};

const detailLevelIcons = {
  concise: List,
  balanced: FileText,
  detailed: AlignLeft,
} as const;

const detailLevelAccents: Record<AiDetailLevelOption, SettingsOptionAccent> = {
  concise: "neutral",
  balanced: "primary",
  detailed: "purple",
};

export const AiPreferencesDetailLevelCard = ({
  draft,
  onChange,
}: AiPreferencesDetailLevelCardProps) => {
  const t = useTranslations("settings.aiPreferences.detail");
  const tSummary = useTranslations("settings.summary");

  const updateDetailLevel = (detailLevel: AiDetailLevelOption) => {
    onChange({ ...draft, detailLevel });
  };

  return (
    <SettingsCard icon={FileText} title={t("title")} description={t("description")}>
      <OptionGrid>
        {aiDetailLevelOptions.map((option) => {
          const Icon = detailLevelIcons[option];
          const isBalanced = option === "balanced";

          return (
            <SettingsOptionCard
              key={option}
              icon={Icon}
              iconAccent={detailLevelAccents[option]}
              title={t(option)}
              subtitle={t(`${option}Subtitle`)}
              badgeLabel={isBalanced ? tSummary("recommended") : undefined}
              selected={draft.detailLevel === option}
              onSelect={() => updateDetailLevel(option)}
            />
          );
        })}
      </OptionGrid>
      <SettingsInfoBox variant="info" icon={FileText}>
        {t(`info.${draft.detailLevel}` as "info.balanced")}
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
