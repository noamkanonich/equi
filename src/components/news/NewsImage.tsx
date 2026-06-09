"use client";

import { useState } from "react";
import styled, { css } from "styled-components";

type NewsImageProps = {
  alt: string;
  imageUrl?: string;
  fallbackLabel?: string;
  $variant?: "featured" | "thumbnail";
};

export const NewsImage = ({
  alt,
  imageUrl,
  fallbackLabel,
  $variant = "thumbnail",
}: NewsImageProps) => {
  const [hasError, setHasError] = useState(false);
  const shouldShowImage = Boolean(imageUrl) && !hasError;

  return (
    <Frame $variant={$variant} aria-hidden={alt ? undefined : true}>
      {shouldShowImage ? (
        <Image
          alt={alt}
          decoding="async"
          loading="lazy"
          src={imageUrl}
          onError={() => setHasError(true)}
        />
      ) : (
        <Placeholder $variant={$variant}>
          {fallbackLabel ? <FallbackLabel>{fallbackLabel}</FallbackLabel> : null}
        </Placeholder>
      )}
    </Frame>
  );
};

const Frame = styled.div<{ $variant: "featured" | "thumbnail" }>`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.background.soft};

  ${({ $variant }) =>
    $variant === "featured"
      ? css`
          inline-size: 100%;
          block-size: 12rem;

          @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
            inline-size: 16rem;
            block-size: 100%;
            min-block-size: 11rem;
          }
        `
      : css`
          inline-size: 4.5rem;
          block-size: 4.5rem;
        `}
`;

const Image = styled.img`
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  display: block;
`;

const Placeholder = styled.div<{ $variant: "featured" | "thumbnail" }>`
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.brand.primarySoft} 0%,
    ${({ theme }) => theme.colors.background.soft} 100%
  );
`;

const FallbackLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
