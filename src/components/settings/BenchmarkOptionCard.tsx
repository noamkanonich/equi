"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";

type BenchmarkOptionCardProps = {
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
};

export const BenchmarkOptionCard = ({
  title,
  subtitle,
  selected,
  onSelect,
}: BenchmarkOptionCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <OptionButton
      type="button"
      $selected={selected}
      onClick={onSelect}
      aria-pressed={selected}
      whileHover={prefersReducedMotion ? undefined : { y: -1 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      {selected ? (
        <CheckWrap aria-hidden>
          <Check size={14} strokeWidth={2.5} />
        </CheckWrap>
      ) : null}
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </OptionButton>
  );
};

const OptionButton = styled(motion.button)<{ $selected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  min-block-size: 5.5rem;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.subtle};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.brand.primarySoft : theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: start;
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

const Title = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  padding-inline-end: ${({ theme }) => theme.spacing.lg};
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
