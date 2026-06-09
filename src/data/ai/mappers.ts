import { mockAiInsightOutputsByContext } from "./ai-output.mock";
import type {
  AiDataFreshness,
  AiInsightAction,
  AiInsightConfidence,
  AiInsightContext,
  AiInsightOutput,
  AiInsightRiskLevel,
  AiInsightSection,
  AiInsightSectionType,
} from "./ai-output.types";
import {
  AI_INSIGHT_CONTEXTS,
  AI_INSIGHT_SECTION_TYPES,
} from "./ai-output.types";

const AI_INSIGHT_CONFIDENCE_LEVELS: readonly AiInsightConfidence[] = [
  "high",
  "medium",
  "low",
] as const;

const AI_INSIGHT_RISK_LEVELS: readonly AiInsightRiskLevel[] = [
  "low",
  "medium",
  "high",
] as const;

const AI_DATA_FRESHNESS_STATUSES: readonly AiDataFreshness["status"][] = [
  "live",
  "recent",
  "stale",
  "mock",
  "unavailable",
] as const;

const AI_INSIGHT_ACTION_TYPES: readonly NonNullable<
  AiInsightAction["actionType"]
>[] = ["navigate", "modal", "local"] as const;

const AI_INSIGHT_SECTION_TONES: readonly NonNullable<
  AiInsightSection["tone"]
>[] = ["positive", "neutral", "warning", "risk"] as const;

export const isAiInsightContext = (value: unknown): value is AiInsightContext =>
  typeof value === "string" &&
  (AI_INSIGHT_CONTEXTS as readonly string[]).includes(value);

export const isAiInsightSectionType = (
  value: unknown,
): value is AiInsightSectionType =>
  typeof value === "string" &&
  (AI_INSIGHT_SECTION_TYPES as readonly string[]).includes(value);

export const isAiInsightConfidence = (
  value: unknown,
): value is AiInsightConfidence =>
  typeof value === "string" &&
  (AI_INSIGHT_CONFIDENCE_LEVELS as readonly string[]).includes(value);

export const isAiInsightRiskLevel = (
  value: unknown,
): value is AiInsightRiskLevel =>
  typeof value === "string" &&
  (AI_INSIGHT_RISK_LEVELS as readonly string[]).includes(value);

const isAiDataFreshness = (value: unknown): value is AiDataFreshness => {
  if (!value || typeof value !== "object") return false;

  const raw = value as AiDataFreshness;
  if (
    !AI_DATA_FRESHNESS_STATUSES.includes(
      raw.status as AiDataFreshness["status"],
    )
  ) {
    return false;
  }

  if (raw.lastUpdated !== undefined && typeof raw.lastUpdated !== "string") {
    return false;
  }

  if (raw.source !== undefined && typeof raw.source !== "string") {
    return false;
  }

  return true;
};

const isAiInsightSection = (value: unknown): value is AiInsightSection => {
  if (!value || typeof value !== "object") return false;

  const raw = value as AiInsightSection;
  if (!isAiInsightSectionType(raw.type)) return false;
  if (typeof raw.titleKey !== "string" || typeof raw.content !== "string") {
    return false;
  }

  if (
    raw.tone !== undefined &&
    !(AI_INSIGHT_SECTION_TONES as readonly string[]).includes(raw.tone)
  ) {
    return false;
  }

  return true;
};

const isAiInsightAction = (value: unknown): value is AiInsightAction => {
  if (!value || typeof value !== "object") return false;

  const raw = value as AiInsightAction;
  if (typeof raw.labelKey !== "string") return false;

  if (raw.targetRoute !== undefined && typeof raw.targetRoute !== "string") {
    return false;
  }

  if (
    raw.actionType !== undefined &&
    !(AI_INSIGHT_ACTION_TYPES as readonly string[]).includes(raw.actionType)
  ) {
    return false;
  }

  return true;
};

export const getAiInsightSection = (
  output: AiInsightOutput,
  sectionType: AiInsightSectionType,
): AiInsightSection | undefined =>
  output.sections.find((section) => section.type === sectionType);

export const getMockAiInsightOutputByContext = (
  context: AiInsightContext,
): AiInsightOutput => mockAiInsightOutputsByContext[context];

/** Always returns typed AI insight output for the given context (mock today). */
export const getAiInsightByContext = getMockAiInsightOutputByContext;

export const normalizeAiInsightOutput = (
  raw: unknown,
): AiInsightOutput | null => {
  // TODO: mapProviderAiResponseToAiInsightOutput — parse real AI JSON before normalizeAiInsightOutput
  if (!raw || typeof raw !== "object") return null;

  const value = raw as AiInsightOutput;

  if (typeof value.id !== "string" || !isAiInsightContext(value.context)) {
    return null;
  }

  if (typeof value.titleKey !== "string" || typeof value.summary !== "string") {
    return null;
  }

  if (!Array.isArray(value.sections) || !value.sections.every(isAiInsightSection)) {
    return null;
  }

  if (
    !Array.isArray(value.suggestedActions) ||
    !value.suggestedActions.every(isAiInsightAction)
  ) {
    return null;
  }

  if (!isAiInsightConfidence(value.confidence)) return null;
  if (!isAiInsightRiskLevel(value.riskLevel)) return null;
  if (!isAiDataFreshness(value.dataFreshness)) return null;
  if (typeof value.disclaimerKey !== "string") return null;

  return value;
};
