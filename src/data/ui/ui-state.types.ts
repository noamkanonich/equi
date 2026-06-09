import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type DataState = "idle" | "loading" | "success" | "empty" | "error";

export type DataFreshnessStatus =
  | "loading"
  | "live"
  | "recent"
  | "stale"
  | "mock"
  | "unavailable";

export type LoadingStateVariant = "page" | "card" | "table" | "chart" | "inline";

export type ListEmptyVariant = "content" | "none" | "filtered";

export type StateAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

export type EmptyStateConfig = {
  title: string;
  description?: string;
  icon?: LucideIcon | ReactNode;
  primaryAction?: StateAction;
  secondaryAction?: StateAction;
  compact?: boolean;
};

export type ErrorStateConfig = {
  title: string;
  description?: string;
  retryAction?: StateAction;
  secondaryAction?: StateAction;
};

export type ResolveDataStateInput = {
  explicitState?: DataState;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
};
