"use client";

import { AlertCircle } from "lucide-react";
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

export type ErrorStateProps = {
  title: string;
  description?: string;
  retryAction?: StateAction;
  secondaryAction?: StateAction;
  $compact?: boolean;
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

export const ErrorState = ({
  title,
  description,
  retryAction,
  secondaryAction,
  $compact = false,
}: ErrorStateProps) => {
  return (
    <ErrorWrap $compact={$compact} role="alert">
      <StateIconWrap $tone="negative">
        <AlertCircle size={20} strokeWidth={1.8} aria-hidden />
      </StateIconWrap>
      <StateTitle $compact={$compact}>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
      {retryAction || secondaryAction ? (
        <StateActions>
          {retryAction ? renderAction(retryAction) : null}
          {secondaryAction ? renderAction(secondaryAction) : null}
        </StateActions>
      ) : null}
    </ErrorWrap>
  );
};

const ErrorWrap = styled(StateWrapper)`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
`;
