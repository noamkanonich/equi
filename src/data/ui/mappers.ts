import type { DataState, ListEmptyVariant, ResolveDataStateInput } from "./ui-state.types";

export const resolveDataState = ({
  explicitState,
  isLoading = false,
  isError = false,
  isEmpty = false,
}: ResolveDataStateInput): DataState => {
  if (explicitState) {
    return explicitState;
  }

  if (isError) {
    return "error";
  }

  if (isLoading) {
    return "loading";
  }

  if (isEmpty) {
    return "empty";
  }

  return "success";
};

export const resolveListEmptyVariant = (
  filteredCount: number,
  totalCount: number,
): ListEmptyVariant => {
  if (filteredCount > 0) {
    return "content";
  }

  if (totalCount === 0) {
    return "none";
  }

  return "filtered";
};
