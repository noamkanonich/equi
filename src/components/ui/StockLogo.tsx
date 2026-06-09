"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useMemo, useState } from "react";
import styled, { css, keyframes } from "styled-components";

type StockLogoSize = "sm" | "md" | "lg";

type StockLogoProps = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  size?: StockLogoSize;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

const getInitials = (symbol: string) => {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return normalizedSymbol.slice(0, 2) || "?";
};

export const StockLogo = ({
  symbol,
  companyName,
  logoUrl,
  size = "sm",
  ...rest
}: StockLogoProps) => {
  return (
    <LogoFrame
      $size={size}
      aria-label={`${companyName} (${symbol})`}
      role="img"
      {...rest}
    >
      <StockLogoContent key={logoUrl ?? "fallback"} symbol={symbol} logoUrl={logoUrl} />
    </LogoFrame>
  );
};

type StockLogoContentProps = {
  symbol: string;
  logoUrl?: string | null;
};

const StockLogoContent = ({ symbol, logoUrl }: StockLogoContentProps) => {
  const [isLoading, setIsLoading] = useState(Boolean(logoUrl));
  const [hasImageError, setHasImageError] = useState(false);
  const initials = useMemo(() => getInitials(symbol), [symbol]);
  const shouldShowImage = Boolean(logoUrl) && !hasImageError;

  return (
    <>
      {shouldShowImage ? (
        <LogoImage
          alt=""
          decoding="async"
          loading="lazy"
          src={logoUrl ?? undefined}
          $loaded={!isLoading}
          onError={() => {
            setHasImageError(true);
            setIsLoading(false);
          }}
          onLoad={() => setIsLoading(false)}
        />
      ) : null}
      {isLoading && shouldShowImage ? <Skeleton aria-hidden /> : null}
      {!shouldShowImage ? <Fallback dir="ltr">{initials}</Fallback> : null}
    </>
  );
};

const sizeStyles = {
  sm: css`
    inline-size: 1.75rem;
    block-size: 1.75rem;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: ${({ theme }) => theme.typography.size.xs};
  `,
  md: css`
    inline-size: 3rem;
    block-size: 3rem;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  `,
  lg: css`
    inline-size: 3.25rem;
    block-size: 3.25rem;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  `,
};

const pulse = keyframes`
  0% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.55;
  }
`;

const LogoFrame = styled.span<{ $size: StockLogoSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.inverse};
  background: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  isolation: isolate;
  ${({ $size }) => sizeStyles[$size]}
`;

const LogoImage = styled.img<{ $loaded: boolean }>`
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background: ${({ theme }) => theme.colors.background.card};
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.16s ease;
`;

const Skeleton = styled.span`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.background.soft};
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const Fallback = styled.span`
  direction: ltr;
  unicode-bidi: isolate;
`;
