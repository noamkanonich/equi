"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styled from "styled-components";

type SettingsInfoBoxVariant = "positive" | "info";

type SettingsInfoBoxProps = {
  variant: SettingsInfoBoxVariant;
  icon: LucideIcon;
  children: ReactNode;
};

export const SettingsInfoBox = ({
  variant,
  icon: Icon,
  children,
}: SettingsInfoBoxProps) => {
  return (
    <Wrap $variant={variant}>
      <IconWrap $variant={variant} aria-hidden>
        <Icon size={18} strokeWidth={1.9} />
      </IconWrap>
      <Message>{children}</Message>
    </Wrap>
  );
};

const Wrap = styled.div<{ $variant: SettingsInfoBoxVariant }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "positive"
        ? `color-mix(in srgb, ${theme.colors.status.positive} 20%, transparent)`
        : `color-mix(in srgb, ${theme.colors.brand.primary} 16%, transparent)`};
  background: ${({ theme, $variant }) =>
    $variant === "positive"
      ? theme.colors.status.positiveSoft
      : theme.colors.brand.primarySoft};
  min-inline-size: 0;
`;

const IconWrap = styled.span<{ $variant: SettingsInfoBoxVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $variant }) =>
    $variant === "positive" ? theme.colors.status.positive : theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.background.card};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  min-inline-size: 0;
`;
