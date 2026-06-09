"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { aiRiskVisibilityKeys } from "@/data/settings/settings.mock";
import type { AiPreferencesState, AiRiskVisibilityKey } from "@/data/settings/settings.types";
import { SettingsCard } from "./SettingsCard";
import { SettingsToggleRow } from "./SettingsToggleRow";

type AiPreferencesRiskVisibilityCardProps = {
  draft: AiPreferencesState;
  onChange: (next: AiPreferencesState) => void;
};

export const AiPreferencesRiskVisibilityCard = ({
  draft,
  onChange,
}: AiPreferencesRiskVisibilityCardProps) => {
  const t = useTranslations("settings.aiPreferences.risk");

  const updateRiskVisibility = (key: AiRiskVisibilityKey, checked: boolean) => {
    onChange({
      ...draft,
      riskVisibility: {
        ...draft.riskVisibility,
        [key]: checked,
      },
    });
  };

  return (
    <SettingsCard icon={ShieldAlert} title={t("title")} description={t("description")}>
      <ToggleList>
        {aiRiskVisibilityKeys.map((key) => (
          <SettingsToggleRow
            key={key}
            title={t(`${key}.title`)}
            description={t(`${key}.description`)}
            checked={draft.riskVisibility[key]}
            onChange={(checked) => updateRiskVisibility(key, checked)}
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
