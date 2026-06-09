"use client";

import {
  Bell,
  Briefcase,
  Palette,
  Plug,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { settingsTabs } from "@/data/settings/mappers";
import type { SettingsTabKey } from "@/data/settings/settings.types";
import { getSettingsTabLabelKey } from "@/utils/settings/getSettingsTabLabel";

type SettingsTabsProps = {
  activeTab: SettingsTabKey;
  onTabChange: (tab: SettingsTabKey) => void;
};

const tabIcons: Record<SettingsTabKey, typeof Settings2> = {
  general: Settings2,
  appearance: Palette,
  portfolio: Briefcase,
  scoringModel: Target,
  alerts: Bell,
  aiPreferences: Sparkles,
  integrations: Plug,
};

export const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  const t = useTranslations("settings.tabs");
  const prefersReducedMotion = useReducedMotion();

  return (
    <Bar>
      <LayoutGroup id="settings-tabs">
        <TabsList aria-label={t("label")}>
          {settingsTabs.map((tab) => {
            const Icon = tabIcons[tab];
            const active = tab === activeTab;
            const labelKey = getSettingsTabLabelKey(tab);

            return (
              <TabButton
                key={tab}
                type="button"
                $active={active}
                aria-pressed={active}
                onClick={() => onTabChange(tab)}
              >
                <TabIconWrap $active={active}>
                  <Icon size={15} strokeWidth={1.9} aria-hidden />
                </TabIconWrap>
                <TabLabel>{t(labelKey)}</TabLabel>
                {active ? (
                  <ActiveUnderline
                    layoutId="settings-active-tab-underline"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                ) : null}
              </TabButton>
            );
          })}
        </TabsList>
      </LayoutGroup>
    </Bar>
  );
};

const Bar = styled.div`
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding-block-end: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const TabsList = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  scrollbar-width: none;
  min-inline-size: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const TabIconWrap = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.muted};
`;

const TabLabel = styled.span``;

const ActiveUnderline = styled(motion.span)`
  position: absolute;
  inset-inline: ${({ theme }) => theme.spacing.sm};
  inset-block-end: -${({ theme }) => theme.spacing.sm};
  block-size: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.brand.primary};
`;
