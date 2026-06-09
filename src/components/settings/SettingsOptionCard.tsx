"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import styled, { css } from "styled-components";
import type { SettingsCardAccent } from "./SettingsCard";

export type SettingsOptionAccent = SettingsCardAccent | "neutral";

type SettingsOptionCardProps = {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  icon?: LucideIcon;
  iconAccent?: SettingsOptionAccent;
  selected: boolean;
  onSelect: () => void;
};

const optionAccentStyles = {
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
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.background.elevated};
  `,
};

export const SettingsOptionCard = ({
  title,
  subtitle,
  badgeLabel,
  icon: Icon,
  iconAccent = "neutral",
  selected,
  onSelect,
}: SettingsOptionCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <OptionButton
      type="button"
      $selected={selected}
      $hasIcon={Boolean(Icon)}
      onClick={onSelect}
      aria-pressed={selected}
      whileHover={prefersReducedMotion ? undefined : { y: -1 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      {badgeLabel ? <Badge>{badgeLabel}</Badge> : null}
      {selected ? (
        <CheckWrap aria-hidden>
          <Check size={14} strokeWidth={2.5} />
        </CheckWrap>
      ) : null}
      {Icon ? (
        <IconWrap $accent={iconAccent} aria-hidden>
          <Icon size={20} strokeWidth={1.9} />
        </IconWrap>
      ) : null}
      <Title>{title}</Title>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </OptionButton>
  );
};

const OptionButton = styled(motion.button)<{
  $selected: boolean;
  $hasIcon: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: ${({ $hasIcon }) => ($hasIcon ? "center" : "flex-start")};
  justify-content: ${({ $hasIcon }) => ($hasIcon ? "center" : "flex-start")};
  gap: ${({ theme }) => theme.spacing.xs};
  min-block-size: ${({ $hasIcon }) => ($hasIcon ? "6.5rem" : "5.5rem")};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.subtle};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.brand.primarySoft : theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: ${({ $hasIcon }) => ($hasIcon ? "center" : "start")};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.strong};
    box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const Badge = styled.span`
  position: absolute;
  inset-block-start: ${({ theme }) => theme.spacing.sm};
  inset-inline-start: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const CheckWrap = styled.span`
  position: absolute;
  inset-block-start: ${({ theme }) => theme.spacing.sm};
  inset-inline-end: ${({ theme }) => theme.spacing.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.375rem;
  block-size: 1.375rem;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text.inverse};
  background: ${({ theme }) => theme.colors.brand.primary};
`;

const IconWrap = styled.span<{ $accent: SettingsOptionAccent }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ $accent }) => optionAccentStyles[$accent]}
`;

const Title = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  padding-inline: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  padding-inline: ${({ theme }) => theme.spacing.xs};
`;
