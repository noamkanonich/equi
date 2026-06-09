"use client";

import {
  ArrowLeftRight,
  Calendar,
  ChevronDown as ChevronDownIcon,
  DollarSign,
  LineChart,
  Shield,
  Target,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { AlertSettingsTypeKey } from "@/data/settings/settings.types";
import type { SettingsCardAccent } from "./SettingsCard";

type AlertSettingsTypeRowProps = {
  typeKey: AlertSettingsTypeKey;
  enabled: boolean;
  index: number;
  onToggleEnabled: (enabled: boolean) => void;
  onConfigure: () => void;
};

const typeIcons: Record<AlertSettingsTypeKey, LucideIcon> = {
  price: DollarSign,
  buyZone: Target,
  earnings: Calendar,
  score: LineChart,
  smartReplace: ArrowLeftRight,
  portfolio: Shield,
};

const typeAccents: Record<AlertSettingsTypeKey, SettingsCardAccent> = {
  price: "positive",
  buyZone: "positive",
  earnings: "purple",
  score: "purple",
  smartReplace: "purple",
  portfolio: "warning",
};

export const AlertSettingsTypeRow = ({
  typeKey,
  enabled,
  index,
  onToggleEnabled,
  onConfigure,
}: AlertSettingsTypeRowProps) => {
  const t = useTranslations("settings.alerts.types");
  const prefersReducedMotion = useReducedMotion();
  const Icon = typeIcons[typeKey];
  const accent = typeAccents[typeKey];

  return (
    <RowWrap
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : index * 0.04,
      }}
    >
      <Row>
        <Main>
          <IconWrap $accent={accent} aria-hidden>
            <Icon size={16} strokeWidth={1.9} />
          </IconWrap>
          <Copy>
            <Title>{t(`${typeKey}.title`)}</Title>
            <Description>{t(`${typeKey}.description`)}</Description>
          </Copy>
        </Main>

        <Actions>
          <ConfigureButton type="button" onClick={onConfigure}>
            {t("configure")}
          </ConfigureButton>
          <SwitchButton
            type="button"
            $active={enabled}
            aria-pressed={enabled}
            aria-label={t(`${typeKey}.title`)}
            onClick={() => onToggleEnabled(!enabled)}
          >
            <SwitchThumb $active={enabled} />
          </SwitchButton>
          <ExpandButton type="button" aria-label={t("configure")} onClick={onConfigure}>
            <ExpandChevron size={16} strokeWidth={1.9} aria-hidden />
          </ExpandButton>
        </Actions>
      </Row>
    </RowWrap>
  );
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

const RowWrap = styled(motion.div)`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
  flex: 1;
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

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Description = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    justify-content: space-between;
  }
`;

const ConfigureButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.elevated};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
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
  margin-inline-start: ${({ $active }) => ($active ? "1.5rem" : "0")};
  transition: margin-inline-start 0.2s cubic-bezier(0.22, 1, 0.36, 1);
`;

const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ExpandChevron = styled(ChevronDownIcon)`
  transform: rotate(-90deg);

  [dir="rtl"] & {
    transform: rotate(90deg);
  }
`;
