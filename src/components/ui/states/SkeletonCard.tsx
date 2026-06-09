"use client";

import styled from "styled-components";
import { SkeletonBlock } from "./skeletonBase";

export type SkeletonCardProps = {
  $showHeader?: boolean;
  $showFooter?: boolean;
  $bodyLines?: number;
};

export const SkeletonCard = ({
  $showHeader = true,
  $showFooter = false,
  $bodyLines = 3,
}: SkeletonCardProps) => {
  return (
    <Card aria-hidden>
      {$showHeader ? (
        <Header>
          <SkeletonBlock $width="40%" $height="1rem" />
          <SkeletonBlock $width="20%" $height="0.75rem" />
        </Header>
      ) : null}
      <Body>
        {Array.from({ length: $bodyLines }, (_, index) => (
          <SkeletonBlock
            key={index}
            $width={index === $bodyLines - 1 ? "65%" : "100%"}
            $height="0.75rem"
          />
        ))}
      </Body>
      {$showFooter ? (
        <Footer>
          <SkeletonBlock $width="30%" $height="0.75rem" />
        </Footer>
      ) : null}
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-block-end: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Footer = styled.div`
  padding-block-start: ${({ theme }) => theme.spacing.sm};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;
