import "server-only";

const HEBREW_MINUS = "\u2212";

const normalizeNumericText = (value: string): string =>
  value
    .trim()
    .replace(/\u00a0/g, "")
    .replace(/%/g, "")
    .replace(/\+/g, "")
    .replace(new RegExp(HEBREW_MINUS, "g"), "-")
    .replace(/,/g, "")
    .replace(/\s/g, "");

export const normalizeScrapedNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = normalizeNumericText(value);

  if (!normalized || normalized === "-" || normalized === ".") {
    return null;
  }

  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : null;
};
