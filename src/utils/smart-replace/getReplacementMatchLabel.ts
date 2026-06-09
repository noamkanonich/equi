import type { ReplacementMatchType } from "@/data/smart-replace/smart-replace.types";

export const getReplacementMatchLabel = (matchType: ReplacementMatchType) => {
  return `smartReplace.matchTypes.${matchType}`;
};
