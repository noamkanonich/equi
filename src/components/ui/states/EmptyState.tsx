"use client";

import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import type { StateAction } from "@/data/ui/ui-state.types";
import {
  StateActions,
  StateDescription,
  StateIconWrap,
  StateTitle,
  StateWrapper,
} from "./stateStyles";

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon | ReactNode;
  primaryAction?: StateAction;
  secondaryAction?: StateAction;
  /** @deprecated Use primaryAction instead */
  action?: ReactNode;
  $compact?: boolean;
};

const renderIcon = (icon: LucideIcon | ReactNode | undefined) => {
  if (!icon) {
    return <Inbox size={20} strokeWidth={1.8} aria-hidden />;
  }

  if (typeof icon === "function") {
    const IconComponent = icon as LucideIcon;
    return <IconComponent size={20} strokeWidth={1.8} aria-hidden />;
  }

  return icon;
};

const renderAction = (action: StateAction) => (
  <Button
    key={action.label}
    $variant={action.variant === "secondary" ? "secondary" : "primary"}
    $size="sm"
    onClick={action.onClick}
  >
    {action.label}
  </Button>
);

export const EmptyState = ({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  action,
  $compact = false,
}: EmptyStateProps) => {
  const hasStructuredActions = Boolean(primaryAction || secondaryAction);

  return (
    <StateWrapper $compact={$compact} role="status">
      <StateIconWrap>{renderIcon(icon)}</StateIconWrap>
      <StateTitle $compact={$compact}>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
      {hasStructuredActions ? (
        <StateActions>
          {primaryAction ? renderAction(primaryAction) : null}
          {secondaryAction ? renderAction(secondaryAction) : null}
        </StateActions>
      ) : action ? (
        <LegacyActionRow>{action}</LegacyActionRow>
      ) : null}
    </StateWrapper>
  );
};

const LegacyActionRow = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;
