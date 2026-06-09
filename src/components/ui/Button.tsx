"use client";

import type { ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $iconOnly?: boolean;
};

export const Button = ({
  $variant = "primary",
  $size = "md",
  $iconOnly = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={$variant}
      $size={$size}
      $iconOnly={$iconOnly}
      type="button"
      {...props}
    >
      {children}
    </StyledButton>
  );
};

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    border: 1px solid ${({ theme }) => theme.colors.brand.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.brand.primaryDark};
      border-color: ${({ theme }) => theme.colors.brand.primaryDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.background.card};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.soft};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.secondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background.soft};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  `,
};

const iconOnlyStyles = css`
  padding: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
`;

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $iconOnly: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-block-size: 2.75rem;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $iconOnly }) => ($iconOnly ? iconOnlyStyles : "")}
  ${({ $size, $iconOnly }) => (!$iconOnly ? sizeStyles[$size] : "")}
  ${({ $variant }) => variantStyles[$variant]}
`;
