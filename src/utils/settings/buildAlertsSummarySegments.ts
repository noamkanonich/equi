import { alertSettingsTypeKeys } from "@/data/settings/settings.mock";
import type {
  AlertSettingsState,
  AlertSettingsSummarySegment,
  AlertSettingsSummarySegmentKey,
} from "@/data/settings/settings.types";
import { getEnabledAlertTypesCount } from "@/utils/settings/getEnabledAlertTypesCount";

const summarySegmentKeys: AlertSettingsSummarySegmentKey[] = [
  "price",
  "earnings",
  "portfolio",
  "buyZone",
  "score",
  "smartReplace",
];

export const buildAlertsSummarySegments = (
  state: AlertSettingsState,
): {
  segments: AlertSettingsSummarySegment[];
  activeCount: number;
} => {
  const enabledCount = getEnabledAlertTypesCount(state);

  const segments = summarySegmentKeys.map((key) => {
    const isTypeEnabled = alertSettingsTypeKeys.includes(
      key as (typeof alertSettingsTypeKeys)[number],
    )
      ? state.enabledTypes[key as (typeof alertSettingsTypeKeys)[number]]
      : false;

    const value = isTypeEnabled ? 1 : 0;
    const percent =
      enabledCount > 0 && isTypeEnabled
        ? Math.round((1 / enabledCount) * 100)
        : 0;

    return { key, value, percent };
  });

  const activeCount = enabledCount;

  return { segments, activeCount };
};
