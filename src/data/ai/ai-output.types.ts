export type AiInsightContext =
  | "dashboard"
  | "portfolio"
  | "stockAnalysis"
  | "fundamentals"
  | "watchlist"
  | "smartReplace"
  | "nextMoves"
  | "alerts"
  | "settingsPreview";

export type AiInsightTone =
  | "conservative"
  | "balanced"
  | "growthOriented";

export type AiInsightDetailLevel =
  | "concise"
  | "balanced"
  | "detailed";

export type AiInsightConfidence = "high" | "medium" | "low";

export type AiInsightRiskLevel = "low" | "medium" | "high";

export type AiInsightSectionType =
  | "summary"
  | "whatsStrong"
  | "riskToWatch"
  | "whatChanged"
  | "suggestedNextStep"
  | "confidence"
  | "dataFreshness"
  | "disclaimer";

export type AiInsightSection = {
  type: AiInsightSectionType;
  titleKey: string;
  content: string;
  tone?: "positive" | "neutral" | "warning" | "risk";
};

export type AiInsightAction = {
  labelKey: string;
  targetRoute?: string;
  actionType?: "navigate" | "modal" | "local";
};

export type AiDataFreshness = {
  status: "live" | "recent" | "stale" | "mock" | "unavailable";
  lastUpdated?: string;
  source?: string;
};

export type AiInsightOutput = {
  id: string;
  context: AiInsightContext;
  titleKey: string;
  summary: string;
  sections: AiInsightSection[];
  suggestedActions: AiInsightAction[];
  confidence: AiInsightConfidence;
  riskLevel: AiInsightRiskLevel;
  dataFreshness: AiDataFreshness;
  disclaimerKey: string;
};

export const AI_INSIGHT_CONTEXTS: readonly AiInsightContext[] = [
  "dashboard",
  "portfolio",
  "stockAnalysis",
  "fundamentals",
  "watchlist",
  "smartReplace",
  "nextMoves",
  "alerts",
  "settingsPreview",
] as const;

export const AI_INSIGHT_SECTION_TYPES: readonly AiInsightSectionType[] = [
  "summary",
  "whatsStrong",
  "riskToWatch",
  "whatChanged",
  "suggestedNextStep",
  "confidence",
  "dataFreshness",
  "disclaimer",
] as const;
