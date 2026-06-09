"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import styled from "styled-components";

type SettingsSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  helperText?: string;
};

export const SettingsSelectField = ({
  id,
  label,
  value,
  onChange,
  children,
  helperText,
}: SettingsSelectFieldProps) => {
  return (
    <Wrap>
      <VisuallyHiddenLabel htmlFor={id}>{label}</VisuallyHiddenLabel>
      <SelectWrap>
        <Select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
        >
          {children}
        </Select>
        <ChevronIcon size={16} strokeWidth={2} aria-hidden />
      </SelectWrap>
      {helperText ? <Helper>{helperText}</Helper> : null}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
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

const SelectWrap = styled.div`
  position: relative;
  inline-size: 100%;
`;

const Select = styled.select`
  inline-size: 100%;
  min-block-size: 3rem;
  padding-inline: ${({ theme }) => theme.spacing.md};
  padding-inline-end: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  cursor: pointer;
  appearance: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primarySoft};
  }
`;

const ChevronIcon = styled(ChevronDown)`
  position: absolute;
  inset-inline-end: ${({ theme }) => theme.spacing.md};
  inset-block-start: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
  pointer-events: none;

  [dir="rtl"] & {
    transform: translateY(-50%) scaleX(-1);
  }
`;

const Helper = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
