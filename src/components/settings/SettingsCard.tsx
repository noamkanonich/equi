"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import { Card } from "@/components/ui/Card";

export type SettingsCardAccent = "primary" | "positive" | "warning" | "purple";

type SettingsCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconAccent?: SettingsCardAccent;
  children: ReactNode;
};

const accentStyles = {
  primary: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 12%,
      transparent
    );
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.status.positive} 12%,
      transparent
    );
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.status.warning} 12%,
      transparent
    );
  `,
  purple: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: ${({ theme }) => theme.colors.chart.sparklineFill.purple};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.chart.purple} 12%,
      transparent
    );
  `,
};

export const SettingsCard = ({
  icon: Icon,
  title,
  description,
  iconAccent = "primary",
  children,
}: SettingsCardProps) => {
  return (
    <StyledCard $padding="md">
      <Header>
        <IconWrap $accent={iconAccent} aria-hidden>
          <Icon size={18} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Copy>
      </Header>
      <Body>{children}</Body>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span<{ $accent: SettingsCardAccent }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  ${({ $accent }) => accentStyles[$accent]}
`;

const Copy = styled.div`
  min-inline-size: 0;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Description = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
