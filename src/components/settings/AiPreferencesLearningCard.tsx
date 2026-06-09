"use client";

import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { aiBehaviorKeys } from "@/data/settings/settings.mock";
import type { AiBehaviorKey, AiPreferencesState } from "@/data/settings/settings.types";
import { SettingsCard } from "./SettingsCard";
import { SettingsToggleRow } from "./SettingsToggleRow";

type AiPreferencesBehaviorCardProps = {
  draft: AiPreferencesState;
  onChange: (next: AiPreferencesState) => void;
};

export const AiPreferencesBehaviorCard = ({
  draft,
  onChange,
}: AiPreferencesBehaviorCardProps) => {
  const t = useTranslations("settings.aiPreferences.behavior");

  const updateBehavior = (key: AiBehaviorKey, checked: boolean) => {
    onChange({
      ...draft,
      behavior: {
        ...draft.behavior,
        [key]: checked,
      },
    });
  };

  return (
    <SettingsCard icon={Bot} iconAccent="purple" title={t("title")} description={t("description")}>
      <ToggleList>
        {aiBehaviorKeys.map((key) => (
          <SettingsToggleRow
            key={key}
            title={t(`${key}.title`)}
            description={t(`${key}.description`)}
            checked={draft.behavior[key]}
            onChange={(checked) => updateBehavior(key, checked)}
          />
        ))}
      </ToggleList>
    </SettingsCard>
  );
};

const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
