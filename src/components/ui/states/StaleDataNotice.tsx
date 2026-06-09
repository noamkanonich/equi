"use client";

import { RefreshCw } from "lucide-react";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import type { StateAction } from "@/data/ui/ui-state.types";
import { formatStaleLastUpdated } from "@/utils/ui/mappers";

export type StaleDataNoticeProps = {
  title: string;
  description?: string;
  sourceDescription?: string;
  lastUpdated?: Date;
  locale?: string;
  lastUpdatedLabel?: string;
  refreshAction?: StateAction;
};

export const StaleDataNotice = ({
  title,
  description,
  sourceDescription,
  lastUpdated,
  locale = "en",
  lastUpdatedLabel,
  refreshAction,
}: StaleDataNoticeProps) => {
  const formattedLastUpdated =
    lastUpdated && lastUpdatedLabel
      ? `${lastUpdatedLabel} ${formatStaleLastUpdated(lastUpdated, locale)}`
      : null;

  return (
    <Notice role="status">
      <IconWrap aria-hidden>
        <RefreshCw size={14} strokeWidth={1.9} />
      </IconWrap>
      <Copy>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
        {sourceDescription ? <SourceDescription>{sourceDescription}</SourceDescription> : null}
        {formattedLastUpdated ? (
          <Timestamp>{formattedLastUpdated}</Timestamp>
        ) : null}
      </Copy>
      {refreshAction ? (
        <Button
          $variant={refreshAction.variant === "primary" ? "primary" : "secondary"}
          $size="sm"
          onClick={refreshAction.onClick}
        >
          {refreshAction.label}
        </Button>
      ) : null}
    </Notice>
  );
};

const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.status.warningSoft};
  background: ${({ theme }) => theme.colors.status.warningSoft};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const IconWrap = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.status.warning};
  margin-block-start: 0.125rem;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  min-inline-size: 0;
  text-align: start;
`;

const Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SourceDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Timestamp = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  color: ${({ theme }) => theme.colors.text.muted};
`;
