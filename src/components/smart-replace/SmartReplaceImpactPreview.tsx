"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { EmptyState } from "@/components/ui/states/EmptyState";
import type { SwapImpactMetric } from "@/data/smart-replace/smart-replace.types";
import { SmartReplaceImpactMetricRow } from "./SmartReplaceImpactMetricRow";

type SmartReplaceImpactPreviewProps = {
  metrics: SwapImpactMetric[];
  locale: string;
  isPreviewActive: boolean;
  replayKey: number;
};

export const SmartReplaceImpactPreview = ({
  metrics,
  locale,
  isPreviewActive,
  replayKey,
}: SmartReplaceImpactPreviewProps) => {
  const t = useTranslations("smartReplace");
  const tStates = useTranslations("states");

  if (metrics.length === 0) {
    return (
      <Card $active={isPreviewActive}>
        <EmptyState
          title={tStates("empty.title")}
          description={t("main.decisionSupportEstimate")}
          $compact
        />
      </Card>
    );
  }

  return (
    <Card $active={isPreviewActive}>
      <Header>
        <Title>{t("main.afterSwapPreview")}</Title>
        <Pill>
          <Info size={14} strokeWidth={1.9} aria-hidden />
          {t("main.doesNotChangePortfolio")}
        </Pill>
      </Header>
      <Grid>
        {metrics.map((metric) => (
          <SmartReplaceImpactMetricRow
            key={metric.key}
            metric={metric}
            locale={locale}
            isPreviewActive={isPreviewActive}
            replayKey={replayKey}
          />
        ))}
      </Grid>
      <Footnote>{t("main.decisionSupportEstimate")}</Footnote>
    </Card>
  );
};

const Card = styled.section<{ $active: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.status.positive : theme.colors.border.subtle};
  background:
    ${({ theme, $active }) =>
      $active
        ? `linear-gradient(135deg, color-mix(in srgb, ${theme.colors.status.positive} 8%, transparent), transparent),`
        : ""}
    ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  border-radius: 999px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Footnote = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
