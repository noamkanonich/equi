/** Returns a finite number or undefined when input is missing/invalid. */
export const normalizeNullableNumber = (
  value: number | null | undefined,
): number | undefined => {
  if (value == null || !Number.isFinite(value)) {
    return undefined;
  }
  return value;
};

/**
 * Normalizes ratio-style values (0–1 decimal or already-scaled percent).
 * Values with |n| > 1 are treated as percents and divided by 100.
 */
export const normalizeRatio = (
  value: number | null | undefined,
): number | undefined => {
  const normalized = normalizeNullableNumber(value);
  if (normalized === undefined) {
    return undefined;
  }
  if (Math.abs(normalized) > 1) {
    return normalized / 100;
  }
  return normalized;
};

/** Maps ratio or percent input to a 0–100 display scale for UI percent fields. */
export const normalizePercent = (
  value: number | null | undefined,
): number | undefined => {
  const ratio = normalizeRatio(value);
  if (ratio === undefined) {
    return undefined;
  }
  return Number((ratio * 100).toFixed(1));
};
