"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type {
  WatchlistAction,
  WatchlistFilters,
  WatchlistStatus,
} from "@/data/watchlist/watchlist.types";
import { mapWatchlistStatusToTone } from "@/data/watchlist/mappers";

type WatchlistFilterModalProps = {
  isOpen: boolean;
  filters: WatchlistFilters;
  onClose: () => void;
  onApply: (filters: WatchlistFilters) => void;
  onClear: () => void;
};

const statusOptions: WatchlistStatus[] = [
  "readyToBuy",
  "waitForPullback",
  "watchClosely",
  "tooExpensive",
  "needsMoreData",
];

const actionOptions: WatchlistAction[] = ["reviewStock", "setAlert", "compare"];
const minimumScoreOptions = [70, 80, 85];

const mapActionToTone = (
  action: WatchlistAction,
): "positive" | "warning" | "neutral" => {
  if (action === "reviewStock") return "positive";
  if (action === "setAlert") return "warning";
  return "neutral";
};

export const WatchlistFilterModal = ({
  isOpen,
  filters,
  onClose,
  onApply,
  onClear,
}: WatchlistFilterModalProps) => {
  const t = useTranslations("watchlist");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.tablet - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, [theme.breakpoints.tablet]);

  const activeDraftCount = useMemo(
    () =>
      filters.statuses.length +
      filters.actions.length +
      (filters.minimumOpportunityScore === null ? 0 : 1) +
      (filters.favoritesOnly ? 1 : 0),
    [filters],
  );

  const toggleStatus = (status: WatchlistStatus) => {
    onApply({
      ...filters,
      statuses: filters.statuses.includes(status)
        ? filters.statuses.filter((selectedStatus) => selectedStatus !== status)
        : [...filters.statuses, status],
    });
  };

  const toggleAction = (action: WatchlistAction) => {
    onApply({
      ...filters,
      actions: filters.actions.includes(action)
        ? filters.actions.filter((selectedAction) => selectedAction !== action)
        : [...filters.actions, action],
    });
  };

  const content = (
    <Content>
      <Header>
        <TitleGroup>
          <Title id={titleId}>{t("filters.title")}</Title>
          <Description id={descriptionId}>{t("filters.description")}</Description>
        </TitleGroup>
        {!isMobile ? (
          <CloseButton type="button" onClick={onClose} aria-label={t("filters.close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        ) : null}
      </Header>

      <Section>
        <SectionTitle>{t("filters.statusTitle")}</SectionTitle>
        <ChipGrid>
          {statusOptions.map((status) => (
            <FilterChip
              key={status}
              type="button"
              $active={filters.statuses.includes(status)}
              $tone={mapWatchlistStatusToTone(status)}
              onClick={() => toggleStatus(status)}
            >
              {t(`status.${status}`)}
            </FilterChip>
          ))}
        </ChipGrid>
      </Section>

      <Section>
        <SectionTitle>{t("filters.actionTitle")}</SectionTitle>
        <ChipGrid>
          {actionOptions.map((action) => (
            <FilterChip
              key={action}
              type="button"
              $active={filters.actions.includes(action)}
              $tone={mapActionToTone(action)}
              onClick={() => toggleAction(action)}
            >
              {t(`actions.${action}`)}
            </FilterChip>
          ))}
        </ChipGrid>
      </Section>

      <Section>
        <SectionTitle>{t("filters.scoreTitle")}</SectionTitle>
        <ChipGrid>
          <FilterChip
            type="button"
            $active={filters.minimumOpportunityScore === null}
            $tone="neutral"
            onClick={() =>
              onApply({
                ...filters,
                minimumOpportunityScore: null,
              })
            }
          >
            {t("filters.anyScore")}
          </FilterChip>
          {minimumScoreOptions.map((score) => (
            <FilterChip
              key={score}
              type="button"
              $active={filters.minimumOpportunityScore === score}
              $tone={score >= 85 ? "positive" : score >= 80 ? "warning" : "neutral"}
              onClick={() =>
                onApply({
                  ...filters,
                  minimumOpportunityScore: score,
                })
              }
            >
              {t("filters.minimumScore", { score })}
            </FilterChip>
          ))}
        </ChipGrid>
      </Section>

      <ToggleRow>
        <ToggleCopy>
          <SectionTitle>{t("filters.favoritesTitle")}</SectionTitle>
          <Description>{t("filters.favoritesDescription")}</Description>
        </ToggleCopy>
        <SwitchButton
          type="button"
          $active={filters.favoritesOnly}
          aria-pressed={filters.favoritesOnly}
          onClick={() =>
            onApply({
              ...filters,
              favoritesOnly: !filters.favoritesOnly,
            })
          }
        >
          <SwitchThumb $active={filters.favoritesOnly} />
        </SwitchButton>
      </ToggleRow>

      <Footer>
        <Button $variant="ghost" onClick={onClear}>
          {t("filters.clear")}
        </Button>
        <Button
          $variant="primary"
          onClick={onClose}
        >
          {activeDraftCount > 0
            ? t("filters.applyWithCount", { count: activeDraftCount })
            : t("filters.apply")}
        </Button>
      </Footer>
    </Content>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t("filters.title")}
        closeLabel={t("filters.close")}
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      {content}
    </Modal>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background:
    radial-gradient(
      circle at 0% 0%,
      ${({ theme }) => theme.colors.brand.primarySoft},
      transparent 34%
    ),
    ${({ theme }) => theme.colors.background.card};
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const CloseButton = styled.button`
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.app};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const getChipColors = (
  tone: "positive" | "warning" | "negative" | "neutral",
  theme: import("@/lib/theme/theme").AppTheme,
) => {
  if (tone === "positive") {
    return {
      text: theme.colors.status.positive,
      soft: theme.colors.status.positiveSoft,
      border: theme.colors.status.positive,
    };
  }

  if (tone === "warning") {
    return {
      text: theme.colors.status.warning,
      soft: theme.colors.status.warningSoft,
      border: theme.colors.status.warning,
    };
  }

  if (tone === "negative") {
    return {
      text: theme.colors.status.negative,
      soft: theme.colors.status.negativeSoft,
      border: theme.colors.status.negative,
    };
  }

  return {
    text: theme.colors.brand.primary,
    soft: theme.colors.brand.primarySoft,
    border: theme.colors.brand.primary,
  };
};

const FilterChip = styled.button<{
  $active: boolean;
  $tone: "positive" | "warning" | "negative" | "neutral";
}>`
  min-block-size: 2.5rem;
  padding-inline: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $active, $tone }) =>
      $active ? getChipColors($tone, theme).border : theme.colors.border.subtle};
  color: ${({ theme, $active, $tone }) =>
    $active ? getChipColors($tone, theme).text : theme.colors.text.secondary};
  background: ${({ theme, $active, $tone }) =>
    $active ? getChipColors($tone, theme).soft : theme.colors.background.card};
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.colors.shadow.soft : "none"};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    transform: translateY(-0.0625rem);
    border-color: ${({ theme, $tone }) => getChipColors($tone, theme).border};
    color: ${({ theme, $tone }) => getChipColors($tone, theme).text};
  }
`;

const ToggleRow = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const ToggleCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
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
`;

const SwitchThumb = styled.span<{ $active: boolean }>`
  display: block;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.card};
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  transform: translateX(${({ $active }) => ($active ? "1.5rem" : "0")});

  html[dir="rtl"] & {
    transform: translateX(${({ $active }) => ($active ? "-1.5rem" : "0")});
  }
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column-reverse;
  }
`;
