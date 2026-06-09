"use client";

import type { LucideIcon } from "lucide-react";
import styled, { css } from "styled-components";
import type { SettingsCardAccent } from "./SettingsCard";

type SettingsSliderAccent = Extract<SettingsCardAccent, "primary" | "positive" | "purple">;

type SettingsSliderFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueLabel: string;
  icon: LucideIcon;
  accent?: SettingsSliderAccent;
  onChange: (value: number) => void;
};

const accentColor = {
  primary: (theme: { colors: { brand: { primary: string } } }) =>
    theme.colors.brand.primary,
  positive: (theme: { colors: { status: { positive: string } } }) =>
    theme.colors.status.positive,
  purple: (theme: { colors: { chart: { purple: string } } }) => theme.colors.chart.purple,
};

const iconAccentStyles = {
  primary: css`
    color: ${({ theme }) => theme.colors.brand.primary};
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  purple: css`
    color: ${({ theme }) => theme.colors.chart.purple};
  `,
};

export const SettingsSliderField = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  valueLabel,
  icon: Icon,
  accent = "primary",
  onChange,
}: SettingsSliderFieldProps) => {
  const fillPercent = ((value - min) / (max - min)) * 100;

  return (
    <Wrap>
      <Header>
        <IconWrap $accent={accent} aria-hidden>
          <Icon size={16} strokeWidth={1.9} />
        </IconWrap>
        <ValueLabel $accent={accent} aria-live="polite">
          {valueLabel}
        </ValueLabel>
      </Header>
      <VisuallyHiddenLabel htmlFor={id}>{label}</VisuallyHiddenLabel>
      <Slider
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        $accent={accent}
        $fillPercent={fillPercent}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span<{ $accent: SettingsSliderAccent }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ $accent }) => iconAccentStyles[$accent]}
`;

const ValueLabel = styled.span<{ $accent: SettingsSliderAccent }>`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  color: ${({ theme, $accent }) => accentColor[$accent](theme)};
`;

const VisuallyHiddenLabel = styled.label`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Slider = styled.input<{
  $accent: SettingsSliderAccent;
  $fillPercent: number;
}>`
  inline-size: 100%;
  block-size: 0.375rem;
  appearance: none;
  border-radius: 999px;
  cursor: pointer;
  background: linear-gradient(
    to right,
    ${({ theme, $accent }) => accentColor[$accent](theme)} 0%,
    ${({ theme, $accent }) => accentColor[$accent](theme)} ${({ $fillPercent }) => `${$fillPercent}%`},
    ${({ theme }) => theme.colors.border.subtle} ${({ $fillPercent }) => `${$fillPercent}%`},
    ${({ theme }) => theme.colors.border.subtle} 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    inline-size: 1.125rem;
    block-size: 1.125rem;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.background.card};
    background: ${({ theme, $accent }) => accentColor[$accent](theme)};
    box-shadow: ${({ theme }) => theme.colors.shadow.soft};
    cursor: pointer;
    transition: transform 0.15s ease;
  }

  &::-moz-range-thumb {
    inline-size: 1.125rem;
    block-size: 1.125rem;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.background.card};
    background: ${({ theme, $accent }) => accentColor[$accent](theme)};
    box-shadow: ${({ theme }) => theme.colors.shadow.soft};
    cursor: pointer;
  }

  &::-moz-range-track {
    block-size: 0.375rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.border.subtle};
  }

  &:focus-visible {
    outline: 2px solid
      ${({ theme, $accent }) =>
        `color-mix(in srgb, ${accentColor[$accent](theme)} 35%, transparent)`};
    outline-offset: 4px;
  }
`;
