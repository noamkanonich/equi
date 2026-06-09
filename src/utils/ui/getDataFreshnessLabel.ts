import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";

type FreshnessTranslator = (key: DataFreshnessStatus) => string;

export const getDataFreshnessLabel = (
  status: DataFreshnessStatus,
  t: FreshnessTranslator,
): string => {
  return t(status);
};
