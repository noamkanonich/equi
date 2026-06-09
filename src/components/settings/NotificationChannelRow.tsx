"use client";

import type { LucideIcon } from "lucide-react";
import styled, { css } from "styled-components";
import type { SettingsCardAccent } from "./SettingsCard";

type NotificationChannelRowProps = {
  icon: LucideIcon;
  accent?: SettingsCardAccent;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
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

export const NotificationChannelRow = ({
  icon: Icon,
  accent = "primary",
  title,
  description,
  checked,
  onChange,
}: NotificationChannelRowProps) => {
  return (
    <Row>
      <Main>
        <IconWrap $accent={accent} aria-hidden>
          <Icon size={16} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Copy>
      </Main>
      <SwitchButton
        type="button"
        $active={checked}
        aria-pressed={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
      >
        <SwitchThumb $active={checked} />
      </SwitchButton>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};

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

const SwitchButton = styled.button<{ $active: boolean }>`
  inline-size: 3.25rem;
  block-size: 1.75rem;
  flex-shrink: 0;
  align-self: center;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-self: flex-end;
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
