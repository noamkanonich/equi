"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Children, useMemo, type ReactElement, type ReactNode } from "react";
import styled from "styled-components";
import type { AlertSettingsState } from "@/data/settings/settings.types";
import { matchesSettingsSearch } from "@/utils/settings/matchesSettingsSearch";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { AlertsSettingsCenterBanner } from "./AlertsSettingsCenterBanner";
import { AlertsSettingsChannelsCard } from "./AlertsSettingsChannelsCard";
import { AlertsSettingsHeaderCard } from "./AlertsSettingsHeaderCard";
import { AlertsSettingsPriorityCard } from "./AlertsSettingsPriorityCard";
import { AlertsSettingsQuickActionsCard } from "./AlertsSettingsQuickActionsCard";
import { AlertsSettingsQuietHoursCard } from "./AlertsSettingsQuietHoursCard";
import { AlertsSettingsRulesOverviewCard } from "./AlertsSettingsRulesOverviewCard";
import { AlertsSettingsSummaryCard } from "./AlertsSettingsSummaryCard";
import { AlertsSettingsTypesCard } from "./AlertsSettingsTypesCard";

type AlertsSettingsTabProps = {
  draft: AlertSettingsState;
  onChange: (next: AlertSettingsState) => void;
  searchQuery?: string;
};

const StaggerColumn = ({
  children,
  startIndex = 0,
}: {
  children: ReactNode;
  startIndex?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {Children.map(children, (child, index) => {
        if (!child) return null;

        return (
          <MotionBlock
            key={(child as ReactElement).key ?? `alerts-block-${index}`}
            initial={prefersReducedMotion ? false : ("hidden" as const)}
            animate="show"
            variants={fadeUpVariants}
            transition={getCardRevealTransition(startIndex + index, prefersReducedMotion)}
          >
            {child}
          </MotionBlock>
        );
      })}
    </>
  );
};

export const AlertsSettingsTab = ({
  draft,
  onChange,
  searchQuery = "",
}: AlertsSettingsTabProps) => {
  const t = useTranslations("settings.alerts");
  const tQuick = useTranslations("settings.alerts.quickActions");
  const tSearch = useTranslations("settings.search");

  const sectionMatches = useMemo(
    () => ({
      header: matchesSettingsSearch(searchQuery, [
        t("header.title"),
        t("header.description"),
        t("header.testNotifications"),
      ]),
      types: matchesSettingsSearch(searchQuery, [
        t("types.title"),
        t("types.description"),
      ]),
      channels: matchesSettingsSearch(searchQuery, [
        t("channels.title"),
        t("channels.description"),
      ]),
      quietHours: matchesSettingsSearch(searchQuery, [
        t("quietHours.title"),
        t("quietHours.description"),
      ]),
      priority: matchesSettingsSearch(searchQuery, [
        t("priority.title"),
        t("priority.description"),
      ]),
      centerBanner: matchesSettingsSearch(searchQuery, [
        t("alertsCenterBanner.message"),
        t("alertsCenterBanner.link"),
      ]),
      summary: matchesSettingsSearch(searchQuery, [
        t("summary.title"),
        t("summary.subtitle"),
      ]),
      rulesOverview: matchesSettingsSearch(searchQuery, [
        t("rulesOverview.title"),
        t("rulesOverview.description"),
      ]),
      quickActions: matchesSettingsSearch(searchQuery, [
        tQuick("title"),
        tQuick("createNewAlert"),
        tQuick("manageRules"),
      ]),
    }),
    [searchQuery, t, tQuick],
  );

  const hasVisibleSection = Object.values(sectionMatches).some(Boolean);

  if (!hasVisibleSection && searchQuery.trim()) {
    return <SearchEmpty>{tSearch("noResults")}</SearchEmpty>;
  }

  return (
    <Layout>
      <MainColumn>
        <StaggerColumn>
          {sectionMatches.header ? <AlertsSettingsHeaderCard /> : null}
          {sectionMatches.types ? (
            <AlertsSettingsTypesCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.channels ? (
            <AlertsSettingsChannelsCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.quietHours ? (
            <AlertsSettingsQuietHoursCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.priority ? (
            <AlertsSettingsPriorityCard draft={draft} onChange={onChange} />
          ) : null}
          {sectionMatches.centerBanner ? <AlertsSettingsCenterBanner /> : null}
        </StaggerColumn>
      </MainColumn>

      <SidebarColumn>
        <StaggerColumn startIndex={6}>
          {sectionMatches.summary ? <AlertsSettingsSummaryCard draft={draft} /> : null}
          {sectionMatches.rulesOverview ? <AlertsSettingsRulesOverviewCard /> : null}
          {sectionMatches.quickActions ? <AlertsSettingsQuickActionsCard /> : null}
        </StaggerColumn>
      </SidebarColumn>
    </Layout>
  );
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SidebarColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MotionBlock = styled(motion.div)`
  min-inline-size: 0;
`;

const SearchEmpty = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
