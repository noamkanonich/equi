"use client";

import {
  BarChart3,
  Info,
  PieChart,
  RefreshCw,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import styled from "styled-components";
import { matchesSettingsSearch } from "@/utils/settings/matchesSettingsSearch";
import {
  benchmarkOptions,
  defaultPortfolioSettings,
  riskProfileOptions,
  targetAllocationOptions,
} from "@/data/settings/settings.mock";
import { getBenchmarkSubtitleKey } from "@/data/settings/mappers";
import type {
  BenchmarkOption,
  PortfolioSettingsState,
  RiskProfileOption,
  TargetAllocationOption,
} from "@/data/settings/settings.types";
import type { SettingsOptionAccent } from "./SettingsOptionCard";
import { BenchmarkOptionCard } from "./BenchmarkOptionCard";
import { PortfolioSettingsQuickActionsCard } from "./PortfolioSettingsQuickActionsCard";
import { PortfolioSettingsSummaryCard } from "./PortfolioSettingsSummaryCard";
import { SettingsCard } from "./SettingsCard";
import { SettingsInfoBox } from "./SettingsInfoBox";
import { SettingsOptionCard } from "./SettingsOptionCard";
import { SettingsSliderField } from "./SettingsSliderField";

type PortfolioSettingsTabProps = {
  draft: PortfolioSettingsState;
  onChange: (next: PortfolioSettingsState) => void;
  searchQuery?: string;
};

const riskProfileIcons = {
  conservative: ShieldCheck,
  moderate: BarChart3,
  aggressive: TrendingUp,
} as const;

const riskProfileAccents: Record<RiskProfileOption, SettingsOptionAccent> = {
  conservative: "positive",
  moderate: "primary",
  aggressive: "warning",
};

const targetAllocationIcons = {
  automatic: Sparkles,
  manual: SlidersHorizontal,
  custom: Wrench,
} as const;

const targetAllocationAccents: Record<TargetAllocationOption, SettingsOptionAccent> = {
  automatic: "primary",
  manual: "neutral",
  custom: "neutral",
};

export const PortfolioSettingsTab = ({
  draft,
  onChange,
  searchQuery = "",
}: PortfolioSettingsTabProps) => {
  const t = useTranslations("settings.portfolio");
  const tSearch = useTranslations("settings.search");

  const sectionMatches = useMemo(
    () => ({
      riskProfile: matchesSettingsSearch(searchQuery, [
        t("riskProfile.title"),
        t("riskProfile.description"),
      ]),
      targetAllocation: matchesSettingsSearch(searchQuery, [
        t("targetAllocation.title"),
        t("targetAllocation.description"),
      ]),
      maxSectorExposure: matchesSettingsSearch(searchQuery, [
        t("maxSectorExposure.title"),
        t("maxSectorExposure.description"),
      ]),
      maxSingleStockExposure: matchesSettingsSearch(searchQuery, [
        t("maxSingleStockExposure.title"),
        t("maxSingleStockExposure.description"),
      ]),
      rebalancingThreshold: matchesSettingsSearch(searchQuery, [
        t("rebalancingThreshold.title"),
        t("rebalancingThreshold.description"),
      ]),
      benchmark: matchesSettingsSearch(searchQuery, [
        t("benchmark.title"),
        t("benchmark.description"),
      ]),
    }),
    [searchQuery, t],
  );

  const hasVisibleSection = Object.values(sectionMatches).some(Boolean);

  const handleResetPortfolioSettings = () => {
    onChange({ ...defaultPortfolioSettings });
  };

  const updateDraft = <K extends keyof PortfolioSettingsState>(
    key: K,
    value: PortfolioSettingsState[K],
  ) => {
    onChange({ ...draft, [key]: value });
  };

  if (!hasVisibleSection && searchQuery.trim()) {
    return <SearchEmpty>{tSearch("noResults")}</SearchEmpty>;
  }

  return (
    <Layout>
      <OptionColumn>
        {sectionMatches.riskProfile ? (
        <SettingsCard
          icon={Shield}
          iconAccent="positive"
          title={t("riskProfile.title")}
          description={t("riskProfile.description")}
        >
          <OptionGrid $columns={3}>
            {riskProfileOptions.map((option) => {
              const Icon = riskProfileIcons[option];

              return (
                <SettingsOptionCard
                  key={option}
                  icon={Icon}
                  iconAccent={riskProfileAccents[option]}
                  title={t(`riskProfile.${option}`)}
                  selected={draft.riskProfile === option}
                  onSelect={() => updateDraft("riskProfile", option as RiskProfileOption)}
                />
              );
            })}
          </OptionGrid>
          <SettingsInfoBox variant="positive" icon={ShieldCheck}>
            {t(`riskProfile.info.${draft.riskProfile}` as "riskProfile.info.moderate")}
          </SettingsInfoBox>
        </SettingsCard>
        ) : null}

        {sectionMatches.targetAllocation ? (
        <SettingsCard
          icon={Target}
          iconAccent="primary"
          title={t("targetAllocation.title")}
          description={t("targetAllocation.description")}
        >
          <OptionGrid $columns={3}>
            {targetAllocationOptions.map((option) => {
              const Icon = targetAllocationIcons[option];

              return (
                <SettingsOptionCard
                  key={option}
                  icon={Icon}
                  iconAccent={targetAllocationAccents[option]}
                  title={t(`targetAllocation.${option}.title`)}
                  subtitle={t(`targetAllocation.${option}.subtitle`)}
                  selected={draft.targetAllocation === option}
                  onSelect={() =>
                    updateDraft("targetAllocation", option as TargetAllocationOption)
                  }
                />
              );
            })}
          </OptionGrid>
          <SettingsInfoBox variant="info" icon={Info}>
            {t(
              `targetAllocation.info.${draft.targetAllocation}` as "targetAllocation.info.automatic",
            )}
          </SettingsInfoBox>
        </SettingsCard>
        ) : null}
      </OptionColumn>

      <SliderColumn>
        {sectionMatches.maxSectorExposure ? (
        <SettingsCard
          icon={PieChart}
          iconAccent="purple"
          title={t("maxSectorExposure.title")}
          description={t("maxSectorExposure.description")}
        >
          <SettingsSliderField
            id="settings-max-sector-exposure"
            label={t("maxSectorExposure.title")}
            icon={PieChart}
            accent="purple"
            min={10}
            max={50}
            step={1}
            value={draft.maxSectorExposure}
            valueLabel={t("maxSectorExposure.valueLabel", {
              value: draft.maxSectorExposure,
            })}
            onChange={(value) => updateDraft("maxSectorExposure", value)}
          />
          <HelperText>{t("maxSectorExposure.helper")}</HelperText>
        </SettingsCard>
        ) : null}

        {sectionMatches.maxSingleStockExposure ? (
        <SettingsCard
          icon={UserRound}
          iconAccent="purple"
          title={t("maxSingleStockExposure.title")}
          description={t("maxSingleStockExposure.description")}
        >
          <SettingsSliderField
            id="settings-max-single-stock-exposure"
            label={t("maxSingleStockExposure.title")}
            icon={UserRound}
            accent="purple"
            min={5}
            max={25}
            step={1}
            value={draft.maxSingleStockExposure}
            valueLabel={t("maxSingleStockExposure.valueLabel", {
              value: draft.maxSingleStockExposure,
            })}
            onChange={(value) => updateDraft("maxSingleStockExposure", value)}
          />
          <HelperText>{t("maxSingleStockExposure.helper")}</HelperText>
        </SettingsCard>
        ) : null}

        {sectionMatches.rebalancingThreshold ? (
        <SettingsCard
          icon={RefreshCw}
          iconAccent="positive"
          title={t("rebalancingThreshold.title")}
          description={t("rebalancingThreshold.description")}
        >
          <SettingsSliderField
            id="settings-rebalancing-threshold"
            label={t("rebalancingThreshold.title")}
            icon={RefreshCw}
            accent="positive"
            min={1}
            max={15}
            step={1}
            value={draft.rebalancingThreshold}
            valueLabel={t("rebalancingThreshold.valueLabel", {
              value: draft.rebalancingThreshold,
            })}
            onChange={(value) => updateDraft("rebalancingThreshold", value)}
          />
          <HelperText>{t("rebalancingThreshold.helper")}</HelperText>
        </SettingsCard>
        ) : null}
      </SliderColumn>

      <SidebarColumn>
        <PortfolioSettingsSummaryCard settings={draft} />
        <PortfolioSettingsQuickActionsCard
          onResetPortfolioSettings={handleResetPortfolioSettings}
        />
      </SidebarColumn>

      {sectionMatches.benchmark ? (
      <BenchmarkSection>
        <SettingsCard
          icon={TrendingUp}
          iconAccent="primary"
          title={t("benchmark.title")}
          description={t("benchmark.description")}
        >
          <BenchmarkGrid>
            {benchmarkOptions.map((option) => (
              <BenchmarkOptionCard
                key={option}
                title={t(`benchmark.${option}` as "benchmark.sp500")}
                subtitle={t(
                  `benchmark.${getBenchmarkSubtitleKey(option)}` as "benchmark.standard",
                )}
                selected={draft.benchmark === option}
                onSelect={() => updateDraft("benchmark", option as BenchmarkOption)}
              />
            ))}
          </BenchmarkGrid>
          <SettingsInfoBox variant="info" icon={Info}>
            {t("benchmark.info")}
          </SettingsInfoBox>
        </SettingsCard>
      </BenchmarkSection>
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
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr) minmax(18rem, 22rem);
  grid-template-rows: auto auto;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const OptionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-column: 1;
  grid-row: 1;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 1;
    grid-row: auto;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SliderColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-column: 2;
  grid-row: 1;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-column: 1;
    grid-row: 2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 1;
    grid-row: auto;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SidebarColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-column: 3;
  grid-row: 1 / span 2;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-column: 2;
    grid-row: 1 / span 3;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 1;
    grid-row: auto;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const BenchmarkSection = styled.div`
  grid-column: 1 / 3;
  grid-row: 2;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-column: 1;
    grid-row: 3;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const OptionGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const BenchmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const HelperText = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
