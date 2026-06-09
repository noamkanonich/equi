"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { StateAction } from "@/data/ui/ui-state.types";
import {
  StateActions,
  StateDescription,
  StateIconWrap,
  StateTitle,
  StateWrapper,
} from "./stateStyles";

export type NoResultsStateProps = {
  title: string;
  description?: string;
  clearAction?: StateAction;
  $compact?: boolean;
};

export const NoResultsState = ({
  title,
  description,
  clearAction,
  $compact = false,
}: NoResultsStateProps) => {
  return (
    <StateWrapper $compact={$compact} role="status">
      <StateIconWrap>
        <SearchX size={20} strokeWidth={1.8} aria-hidden />
      </StateIconWrap>
      <StateTitle $compact={$compact}>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
      {clearAction ? (
        <StateActions>
          <Button
            $variant={clearAction.variant === "primary" ? "primary" : "secondary"}
            $size="sm"
            onClick={clearAction.onClick}
          >
            {clearAction.label}
          </Button>
        </StateActions>
      ) : null}
    </StateWrapper>
  );
};
