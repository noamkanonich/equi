"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { LoadingStateVariant } from "@/data/ui/ui-state.types";
import { SkeletonCard } from "./SkeletonCard";
import { SkeletonChart } from "./SkeletonChart";
import { SkeletonTable } from "./SkeletonTable";
import { StateDescription, StateTitle, StateWrapper } from "./stateStyles";

export type LoadingStateProps = {
  title?: string;
  description?: string;
  variant?: LoadingStateVariant;
  tableRows?: number;
  tableColumns?: number;
  $compact?: boolean;
};

export const LoadingState = ({
  title,
  description,
  variant = "card",
  tableRows = 5,
  tableColumns = 6,
  $compact = false,
}: LoadingStateProps) => {
  const t = useTranslations("states.loading");

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");

  const skeleton = (() => {
    switch (variant) {
      case "page":
        return <SkeletonCard $bodyLines={4} $showFooter />;
      case "table":
        return (
          <SkeletonWrap>
            <SkeletonTable $rows={tableRows} $columns={tableColumns} />
          </SkeletonWrap>
        );
      case "chart":
        return <SkeletonChart />;
      case "inline":
        return <InlineSkeleton aria-hidden />;
      case "card":
      default:
        return <SkeletonCard />;
    }
  })();

  if (variant === "inline") {
    return (
      <InlineWrap role="status" aria-busy="true">
        <InlineSkeleton aria-hidden />
        <InlineCopy>
          <StateTitle $compact>{resolvedTitle}</StateTitle>
        </InlineCopy>
      </InlineWrap>
    );
  }

  return (
    <Wrap role="status" aria-busy="true">
      {!$compact && variant !== "table" && variant !== "chart" ? (
        <StateWrapper $compact>
          <StateTitle>{resolvedTitle}</StateTitle>
          {resolvedDescription ? (
            <StateDescription>{resolvedDescription}</StateDescription>
          ) : null}
        </StateWrapper>
      ) : null}
      {skeleton}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const SkeletonWrap = styled.div`
  min-inline-size: 0;
`;

const InlineWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const InlineCopy = styled.div`
  min-inline-size: 0;
`;

const InlineSkeleton = styled.span`
  display: inline-block;
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.background.soft};
  animation: pulse 1.2s ease-in-out infinite;
  flex-shrink: 0;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.55;
    }

    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.75;
  }
`;
