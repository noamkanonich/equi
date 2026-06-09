"use client";

import { Gauge } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { SwapImpactMetric } from "@/data/smart-replace/smart-replace.types";
import { SmartReplaceImpactMetricRow } from "./SmartReplaceImpactMetricRow";

type SmartReplaceImpactCardProps = {
  metrics: SwapImpactMetric[];
  locale: string;
  isPreviewActive: boolean;
  replayKey: number;
};

export const SmartReplaceImpactCard = ({
  metrics,
  locale,
  isPreviewActive,
  replayKey,
}: SmartReplaceImpactCardProps) => {
  const t = useTranslations("smartReplace");

  return (
    <Card $active={isPreviewActive}>
      <Header>
        <IconWrap>
          <Gauge size={16} strokeWidth={1.9} aria-hidden />
        </IconWrap>
        <Title>{t("sidebar.swapImpactEstimate")}</Title>
      </Header>
      <Rows>
        {metrics.slice(0, 4).map((metric) => (
          <SmartReplaceImpactMetricRow
            key={metric.key}
            metric={metric}
            locale={locale}
            isPreviewActive={isPreviewActive}
            replayKey={replayKey}
            mode="detailed"
          />
        ))}
      </Rows>
      <Footnote>{t("sidebar.impactAssumption")}</Footnote>
    </Card>
  );
};

const Card = styled.section<{ $active: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background:
    ${({ theme, $active }) =>
      $active
        ? `linear-gradient(135deg, color-mix(in srgb, ${theme.colors.status.positive} 8%, transparent), transparent),`
        : ""}
    ${({ theme }) => theme.colors.background.card};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.status.positive : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  transition:
    background 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Rows = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Footnote = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
