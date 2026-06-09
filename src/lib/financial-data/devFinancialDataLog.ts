import "server-only";

const isDevFinancialDataDebug = (): boolean =>
  process.env.NODE_ENV === "development";

export const logFinancialDataDebug = (
  event: string,
  payload: Record<string, unknown>,
): void => {
  if (!isDevFinancialDataDebug()) {
    return;
  }
  console.info(`[financial-data] ${event}`, payload);
};

/** Path only — strips query string and never includes apikey. */
export const getFmpLogPath = (url: string): string => {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    const withoutQuery = url.split("?")[0] ?? url;
    return withoutQuery.replace(/^https?:\/\/[^/]+/, "") || withoutQuery;
  }
};
