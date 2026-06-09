import { z } from "zod";
import { normalizeAiPreferencesState, normalizeAlertSettingsState } from "@/data/settings/mappers";
import {
  aiBehaviorKeys,
  aiDetailLevelOptions,
  aiExplanationSectionKeys,
  aiRiskVisibilityKeys,
  aiToneOptions,
  alertNotificationChannelKeys,
  alertPriorityKeys,
  alertSettingsTypeKeys,
  benchmarkOptions,
  currencyOptions,
  dateFormatOptions,
  languageOptions,
  layoutDensityOptions,
  marketRegionOptions,
  motionPreferenceOptions,
  quietHoursOptions,
  riskProfileOptions,
  targetAllocationOptions,
  themeOptions,
} from "@/data/settings/settings.mock";
import { scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type {
  EquiSettingsExportPayload,
  SettingsImportResult,
} from "@/data/settings/settings.types";

const booleanRecordSchema = <T extends readonly string[]>(keys: T) =>
  z.object(
    Object.fromEntries(keys.map((key) => [key, z.boolean()])) as Record<
      T[number],
      z.ZodBoolean
    >,
  );

const scoringWeightsSchema = z.object(
  Object.fromEntries(scoringFactorKeys.map((key) => [key, z.number()])) as Record<
    (typeof scoringFactorKeys)[number],
    z.ZodNumber
  >,
);

const equiSettingsExportSchema = z.object({
  version: z.literal("1"),
  exportedAt: z.string(),
  general: z.object({
    language: z.enum(languageOptions),
    displayCurrency: z.enum(currencyOptions),
    marketRegion: z.enum(marketRegionOptions as [string, ...string[]]),
    dateFormat: z.enum(dateFormatOptions as [string, ...string[]]),
    benchmark: z.enum(benchmarkOptions as [string, ...string[]]),
  }),
  appearance: z.object({
    theme: z.enum(themeOptions),
    backgroundGlow: z.number(),
    layoutDensity: z.enum(layoutDensityOptions),
    chartAnimations: z.boolean(),
    cardRadius: z.number(),
    motionPreference: z.enum(motionPreferenceOptions),
  }),
  portfolio: z.object({
    riskProfile: z.enum(riskProfileOptions as [string, ...string[]]),
    targetAllocation: z.enum(targetAllocationOptions as [string, ...string[]]),
    benchmark: z.enum(benchmarkOptions as [string, ...string[]]),
    maxSectorExposure: z.number(),
    maxSingleStockExposure: z.number(),
    rebalancingThreshold: z.number(),
  }),
  scoringModel: z.object({
    weights: scoringWeightsSchema,
    isCustomModel: z.boolean(),
  }),
  alerts: z.preprocess(
    (value) => {
      if (!value || typeof value !== "object") {
        return value;
      }
      return normalizeAlertSettingsState(value as Record<string, unknown>);
    },
    z.object({
      enabledTypes: booleanRecordSchema([...alertSettingsTypeKeys, "analyst"] as const),
      channels: booleanRecordSchema(alertNotificationChannelKeys),
      quietHours: z.enum(quietHoursOptions as [string, ...string[]]),
      enabledPriorities: booleanRecordSchema(alertPriorityKeys),
    }),
  ),
  aiPreferences: z.preprocess(
    (value) => {
      if (!value || typeof value !== "object") {
        return value;
      }
      return normalizeAiPreferencesState(value as Record<string, unknown>);
    },
    z.object({
      detailLevel: z.enum(aiDetailLevelOptions as [string, ...string[]]),
      tone: z.enum(aiToneOptions as [string, ...string[]]),
      riskVisibility: booleanRecordSchema(aiRiskVisibilityKeys),
      enabledSections: booleanRecordSchema(aiExplanationSectionKeys),
      behavior: booleanRecordSchema(aiBehaviorKeys),
    }),
  ),
});

export const validateImportedSettings = (rawText: string): SettingsImportResult => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { ok: false, reason: "invalidJson" };
  }

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "invalidFormat" };
  }

  const record = parsed as Record<string, unknown>;

  if (record.version !== "1") {
    return { ok: false, reason: "unsupportedVersion" };
  }

  const result = equiSettingsExportSchema.safeParse(parsed);

  if (!result.success) {
    return { ok: false, reason: "invalidFormat" };
  }

  return { ok: true, payload: result.data as EquiSettingsExportPayload };
};
