"use client";

import { LineChart } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SettingsCard } from "./SettingsCard";

type AppearanceChartAnimationsCardProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const AppearanceChartAnimationsCard = ({
  checked,
  onChange,
}: AppearanceChartAnimationsCardProps) => {
  const t = useTranslations("settings.appearance.chartAnimations");

  return (
    <SettingsCard icon={LineChart} title={t("title")} description={t("description")}>
      <ToggleRow>
        <SwitchButton
          type="button"
          $active={checked}
          aria-pressed={checked}
          aria-label={t("title")}
          onClick={() => onChange(!checked)}
        >
          <SwitchThumb $active={checked} />
        </SwitchButton>
      </ToggleRow>
    </SettingsCard>
  );
};

const ToggleRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SwitchButton = styled.button<{ $active: boolean }>`
  inline-size: 3.25rem;
  block-size: 1.75rem;
  flex-shrink: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.border.strong};
  cursor: pointer;
  transition: background 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const SwitchThumb = styled.span<{ $active: boolean }>`
  display: block;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.card};
  transition: margin-inline-start 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  margin-inline-start: ${({ $active }) => ($active ? "1.5rem" : "0")};
`;
