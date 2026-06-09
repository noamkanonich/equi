"use client";

import {
  BadgeDollarSign,
  ChevronDown as ChevronDownIcon,
  Scale,
  Shield,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { ScoringFactorKey, ScoringFactorImpact } from "@/data/scoring/scoring.types";
import type { SettingsCardAccent } from "./SettingsCard";
import { ScoringWeightSlider } from "./ScoringWeightSlider";
import {
  SCORING_FACTORS_TABLE_COLUMN_GAP,
  SCORING_FACTORS_TABLE_COLUMNS,
} from "./scoringFactorsTableLayout";

type ScoringModelFactorRowProps = {
  factorKey: ScoringFactorKey;
  weight: number;
  impact: ScoringFactorImpact;
  accent: SettingsCardAccent;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onWeightChange: (weight: number) => void;
};

const factorIcons: Record<ScoringFactorKey, LucideIcon> = {
  growth: TrendingUp,
  profitability: BadgeDollarSign,
  valuation: Scale,
  financialHealth: Shield,
  momentum: Zap,
  analystSentiment: Users,
};

const accentStyles = {
  primary: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  purple: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: ${({ theme }) => theme.colors.chart.sparklineFill.purple};
  `,
};

const clampWeight = (value: number) => {
  const stepped = Math.round(Math.max(0, Math.min(100, value)) / 5) * 5;
  return stepped;
};

export const ScoringModelFactorRow = ({
  factorKey,
  weight,
  impact,
  accent,
  isExpanded,
  onToggleExpand,
  onWeightChange,
}: ScoringModelFactorRowProps) => {
  const t = useTranslations("settings.scoringModel");
  const Icon = factorIcons[factorKey];

  const handleInputChange = (raw: string) => {
    const parsed = Number.parseInt(raw.replace(/\D/g, ""), 10);
    if (Number.isNaN(parsed)) {
      onWeightChange(0);
      return;
    }
    onWeightChange(clampWeight(parsed));
  };

  return (
    <RowGrid>
      <FactorCell>
        <IconWrap $accent={accent} aria-hidden>
          <Icon size={16} strokeWidth={1.9} />
        </IconWrap>
        <FactorTitle>{t(`factors.${factorKey}.title`)}</FactorTitle>
      </FactorCell>

      <DescriptionCell>
        <FactorDescription>{t(`factors.${factorKey}.description`)}</FactorDescription>
      </DescriptionCell>

      <WeightCell>
        <WeightControls>
          <WeightInput
            type="text"
            inputMode="numeric"
            value={String(weight)}
            onChange={(event) => handleInputChange(event.target.value)}
            aria-label={t("weightInputLabel", { factor: t(`factors.${factorKey}.title`) })}
          />
          <WeightSuffix>%</WeightSuffix>
        </WeightControls>
        <ScoringWeightSlider
          value={weight}
          onChange={onWeightChange}
          ariaLabel={t(`factors.${factorKey}.title`)}
        />
      </WeightCell>

      <ImpactCell>
        <ImpactBadge $impact={impact}>{t(`impact.${impact}`)}</ImpactBadge>
      </ImpactCell>

      <ExpandCell>
        <ExpandButton
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-label={t(`factors.${factorKey}.title`)}
        >
          <ExpandIcon size={18} strokeWidth={1.9} $expanded={isExpanded} aria-hidden />
        </ExpandButton>
      </ExpandCell>

      {isExpanded ? (
        <DetailsPanel>{t(`factors.${factorKey}.details`)}</DetailsPanel>
      ) : null}
    </RowGrid>
  );
};

const RowGrid = styled.div`
  display: grid;
  grid-template-columns: ${SCORING_FACTORS_TABLE_COLUMNS};
  column-gap: ${SCORING_FACTORS_TABLE_COLUMN_GAP};
  align-items: center;
  padding-inline: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-of-type {
    border-block-end: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "factor expand"
      "description description"
      "impact impact"
      "weight weight";
    row-gap: ${({ theme }) => theme.spacing.sm};
    align-items: start;
  }
`;

const FactorCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: factor;
  }
`;

const IconWrap = styled.span<{ $accent: SettingsCardAccent }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ $accent }) => accentStyles[$accent]}
`;

const FactorTitle = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const DescriptionCell = styled.div`
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: description;
  }
`;

const FactorDescription = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const WeightCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  inline-size: 100%;
  min-inline-size: 0;
  justify-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: weight;
  }
`;

const WeightControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  align-self: flex-end;
`;

const WeightInput = styled.input`
  inline-size: 2.75rem;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  font-variant-numeric: tabular-nums;
  text-align: center;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const WeightSuffix = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const impactStyles = {
  high: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 18%,
      transparent
    );
  `,
  medium: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.status.warning} 18%,
      transparent
    );
  `,
  low: css`
    color: ${({ theme }) => theme.colors.status.neutral};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.status.neutral} 18%,
      transparent
    );
  `,
};

const ImpactBadge = styled.span<{ $impact: ScoringFactorImpact }>`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  ${({ $impact }) => impactStyles[$impact]}
`;

const ImpactCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  justify-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: impact;
    justify-content: flex-start;
  }
`;

const ExpandCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  justify-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: expand;
    align-self: start;
  }
`;

const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ExpandIcon = styled(ChevronDownIcon)<{ $expanded: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0deg")});
`;

const DetailsPanel = styled.div`
  grid-column: 1 / -1;
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
