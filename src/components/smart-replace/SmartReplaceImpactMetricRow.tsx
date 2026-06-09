"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { SwapImpactMetric } from "@/data/smart-replace/smart-replace.types";
import { getSwapImpactDelta } from "@/utils/smart-replace/getSwapImpactDelta";
import { formatSwapImpactValue } from "@/utils/smart-replace/mappers";

type SmartReplaceImpactMetricRowProps = {
  metric: SwapImpactMetric;
  locale: string;
  isPreviewActive: boolean;
  replayKey: number;
  mode?: "compact" | "detailed";
};

export const SmartReplaceImpactMetricRow = ({
  metric,
  locale,
  isPreviewActive,
  replayKey,
  mode = "compact",
}: SmartReplaceImpactMetricRowProps) => {
  const t = useTranslations("smartReplace");
  const delta = getSwapImpactDelta(metric);
  const activeValue = isPreviewActive ? metric.after : metric.before;

  const formatValue = (value: number) => formatSwapImpactValue(value, metric, locale);
  const deltaLabel = metric.lowerIsBetter
    ? t("impact.lowerRisk")
    : formatSwapImpactValue(delta.displayDelta, metric, locale);

  return (
    <Row $active={isPreviewActive} $improvement={delta.isImprovement} $mode={mode}>
      <LabelGroup $mode={mode}>
        <AccentDot $active={isPreviewActive} $improvement={delta.isImprovement} />
        <Label>{t(`impact.${metric.key}`)}</Label>
      </LabelGroup>
      <ValueRail $mode={mode}>
        <BeforeValue $visible={isPreviewActive} dir="ltr">
          {formatValue(metric.before)}
        </BeforeValue>
        <Arrow $visible={isPreviewActive} aria-hidden>
          →
        </Arrow>
        <Value $mode={mode} dir="ltr">
          <AnimatedNumber
            value={activeValue}
            formatter={formatValue}
            decimals={metric.decimals}
            replayKey={replayKey}
          />
        </Value>
        <Delta
          as={motion.span}
          $visible={isPreviewActive}
          $improvement={delta.isImprovement}
          $mode={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: isPreviewActive ? 1 : 0, y: isPreviewActive ? 0 : 6 }}
        >
          {deltaLabel}
        </Delta>
      </ValueRail>
    </Row>
  );
};

const Row = styled.div<{
  $active: boolean;
  $improvement: boolean;
  $mode: "compact" | "detailed";
}>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ $mode }) =>
    $mode === "detailed" ? "minmax(0, 1fr) auto" : "minmax(0, 1fr)"};
  gap: ${({ theme, $mode }) =>
    $mode === "detailed" ? theme.spacing.sm : theme.spacing.md};
  align-items: ${({ $mode }) => ($mode === "detailed" ? "center" : "stretch")};
  min-block-size: ${({ $mode }) => ($mode === "compact" ? "5rem" : "3.75rem")};
  padding: ${({ theme, $mode }) =>
    $mode === "detailed"
      ? `${theme.spacing.sm} ${theme.spacing.md}`
      : theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $active, $improvement }) =>
      $active
        ? $improvement
          ? theme.colors.status.positiveSoft
          : theme.colors.status.negativeSoft
        : theme.colors.border.subtle};
  background:
    linear-gradient(
      135deg,
      ${({ theme, $active, $improvement }) =>
        $active
          ? $improvement
            ? `color-mix(in srgb, ${theme.colors.status.positive} 10%, transparent)`
            : `color-mix(in srgb, ${theme.colors.status.negative} 10%, transparent)`
          : `color-mix(in srgb, ${theme.colors.brand.primary} 4%, transparent)`},
      transparent
    ),
    ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.colors.shadow.soft : "none"};
  overflow: hidden;
  transition:
    background 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const LabelGroup = styled.span<{ $mode: "compact" | "detailed" }>`
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  ${({ $mode }) =>
    $mode === "compact" &&
    css`
      align-self: start;
    `}
`;

const AccentDot = styled.span<{ $active: boolean; $improvement: boolean }>`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
  background: ${({ theme, $active, $improvement }) =>
    !$active
      ? theme.colors.brand.primary
      : $improvement
        ? theme.colors.status.positive
        : theme.colors.status.negative};
  box-shadow: 0 0 0 0.25rem
    ${({ theme, $active, $improvement }) =>
      !$active
        ? theme.colors.brand.primarySoft
        : $improvement
          ? theme.colors.status.positiveSoft
          : theme.colors.status.negativeSoft};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  overflow-wrap: anywhere;
`;

const ValueRail = styled.span<{ $mode: "compact" | "detailed" }>`
  min-inline-size: 0;
  display: grid;
  grid-template-columns: auto auto minmax(0, auto);
  align-items: center;
  justify-content: ${({ $mode }) => ($mode === "detailed" ? "end" : "start")};
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: ${({ $mode }) => ($mode === "detailed" ? "end" : "start")};
  ${({ $mode }) =>
    $mode === "compact" &&
    css`
      align-self: end;
    `}
`;

const Value = styled.strong<{ $mode: "compact" | "detailed" }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme, $mode }) =>
    $mode === "detailed"
      ? theme.typography.preset.cardTitle.fontSize
      : theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.03em;
  white-space: nowrap;
`;

const BeforeValue = styled.span<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "inline-flex" : "none")};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Arrow = styled.span<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "inline" : "none")};
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Delta = styled.span<{
  $visible: boolean;
  $improvement: boolean;
  $mode: "compact" | "detailed";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-column: 1 / -1;
  justify-self: ${({ $mode }) => ($mode === "detailed" ? "end" : "start")};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  pointer-events: none;
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  ${({ $improvement }) =>
    $improvement
      ? css`
          color: ${({ theme }) => theme.colors.status.positive};
          background: ${({ theme }) => theme.colors.status.positiveSoft};
        `
      : css`
          color: ${({ theme }) => theme.colors.status.negative};
          background: ${({ theme }) => theme.colors.status.negativeSoft};
        `}
`;
