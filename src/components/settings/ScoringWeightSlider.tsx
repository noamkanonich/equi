"use client";

import styled from "styled-components";

type ScoringWeightSliderProps = {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
};

export const ScoringWeightSlider = ({
  value,
  onChange,
  ariaLabel,
}: ScoringWeightSliderProps) => {
  const fillPercent = value;

  return (
    <Slider
      type="range"
      min={0}
      max={100}
      step={5}
      value={value}
      $fillPercent={fillPercent}
      onChange={(event) => onChange(Number(event.target.value))}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    />
  );
};

const Slider = styled.input<{ $fillPercent: number }>`
  inline-size: 100%;
  min-inline-size: 0;
  block-size: 0.375rem;
  appearance: none;
  border-radius: 999px;
  cursor: pointer;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.brand.primary} 0%,
    ${({ theme }) => theme.colors.brand.primary} ${({ $fillPercent }) => `${$fillPercent}%`},
    ${({ theme }) => theme.colors.border.subtle} ${({ $fillPercent }) => `${$fillPercent}%`},
    ${({ theme }) => theme.colors.border.subtle} 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.background.card};
    background: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.background.card};
    background: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 4px;
  }
`;
