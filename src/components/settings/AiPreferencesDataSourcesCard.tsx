"use client";

import { useState } from "react";
import { LayoutList } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { aiExplanationSectionKeys } from "@/data/settings/settings.mock";
import type {
  AiExplanationSectionKey,
  AiPreferencesState,
} from "@/data/settings/settings.types";
import { SettingsCard } from "./SettingsCard";
import { SettingsInfoBox } from "./SettingsInfoBox";
import { SettingsToggleRow } from "./SettingsToggleRow";

type AiPreferencesExplanationStructureCardProps = {
  draft: AiPreferencesState;
  onChange: (next: AiPreferencesState) => void;
};

export const AiPreferencesExplanationStructureCard = ({
  draft,
  onChange,
}: AiPreferencesExplanationStructureCardProps) => {
  const t = useTranslations("settings.aiPreferences.structure");
  const [showSummaryWarning, setShowSummaryWarning] = useState(false);

  const updateSection = (key: AiExplanationSectionKey, checked: boolean) => {
    if (key === "summary" && !checked) {
      setShowSummaryWarning(true);
      return;
    }

    setShowSummaryWarning(false);
    onChange({
      ...draft,
      enabledSections: {
        ...draft.enabledSections,
        [key]: checked,
      },
    });
  };

  return (
    <SettingsCard icon={LayoutList} title={t("title")} description={t("description")}>
      <ToggleList>
        {aiExplanationSectionKeys.map((key) => (
          <SettingsToggleRow
            key={key}
            title={t(key)}
            checked={draft.enabledSections[key]}
            disabled={key === "summary"}
            onChange={(checked) => updateSection(key, checked)}
          />
        ))}
      </ToggleList>
      {showSummaryWarning ? (
        <SettingsInfoBox variant="info" icon={LayoutList}>
          {t("summaryRequiredWarning")}
        </SettingsInfoBox>
      ) : null}
    </SettingsCard>
  );
};

const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
