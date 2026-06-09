"use client";

import type { HTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  $padding?: "sm" | "md" | "lg";
  /** When false, disables hover elevation (static data cards). Default true. */
  $interactive?: boolean;
};

export const Card = ({
  children,
  $padding = "md",
  $interactive = true,
  ...props
}: CardProps) => {
  return (
    <StyledCard $padding={$padding} $interactive={$interactive} {...props}>
      {children}
    </StyledCard>
  );
};

const paddingMap = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.md};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.lg};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.xl};
  `,
};

const StyledCard = styled.div<{
  $padding: "sm" | "md" | "lg";
  $interactive: boolean;
}>`
  min-inline-size: 0;
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  transition: box-shadow 0.16s ease, border-color 0.16s ease;

  ${({ $interactive, theme }) =>
    $interactive
      ? css`
          @media (hover: hover) {
            &:hover {
              box-shadow: ${theme.colors.shadow.soft};
            }
          }
        `
      : ""}

  ${({ $padding }) => paddingMap[$padding]}
`;
