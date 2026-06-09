import type { FinancialDataSection } from "@/data/financial-data/financial-data.types";

type AppDataLogPayload = Record<string, string | number | boolean | string[] | undefined>;

const isDev = (): boolean => process.env.NODE_ENV === "development";

export const logAppDataDebug = (message: string, payload?: AppDataLogPayload): void => {
  if (!isDev()) {
    return;
  }

  if (payload) {
    console.info(`[app-data] ${message}`, payload);
    return;
  }

  console.info(`[app-data] ${message}`);
};

export const logAppDataFreshSkipped = (symbols: string[]): void => {
  if (!isDev() || symbols.length === 0) {
    return;
  }
  console.info(`[app-data] fresh skipped: [${symbols.join(", ")}]`);
};

export const logAppDataInflightSkipped = (symbols: string[]): void => {
  if (!isDev() || symbols.length === 0) {
    return;
  }
  console.info(`[app-data] in-flight skipped: [${symbols.join(", ")}]`);
};

export const logAppDataStartupSymbols = (symbols: string[]): void => {
  if (!isDev()) {
    return;
  }
  console.info(
    `[app-data] startup portfolio symbols: ${symbols.length}${symbols.length > 0 ? ` (${symbols.join(",")})` : ""}`,
  );
};

export const logAppDataAuthMode = (mode: "authenticated" | "local"): void => {
  if (!isDev()) {
    return;
  }
  console.info(`[app-data] auth mode: ${mode}`);
};

export const logAppDataLoadedPortfolioHoldings = (count: number): void => {
  if (!isDev()) {
    return;
  }
  console.info(`[app-data] loaded supabase portfolio holdings: ${count}`);
};

export const logAppDataUsingDemoPortfolio = (usingDemo: boolean): void => {
  if (!isDev()) {
    return;
  }
  console.info(`[app-data] using demo portfolio: ${usingDemo}`);
};

export const logDashboardPortfolioHoldingsCount = (count: number): void => {
  if (!isDev()) {
    return;
  }
  console.info(`[dashboard] portfolio holdings count: ${count}`);
};

export const logReportsPortfolioHoldingsCount = (count: number): void => {
  if (!isDev()) {
    return;
  }
  console.info(`[reports] portfolio holdings count: ${count}`);
};

export const logAppDataSymbolTruncation = (input: {
  requestedCount: number;
  maxSymbols: number;
}): void => {
  if (!isDev()) {
    return;
  }
  console.warn(
    `[app-data] symbol list truncated: ${input.requestedCount} unique symbols requested, capped at ${input.maxSymbols}`,
  );
};

export const logEnsureStockDataSummary = (input: {
  requestedCount: number;
  uniqueCount: number;
  freshSkippedSymbols: string[];
  fetchingSymbols: string[];
  sections?: FinancialDataSection[];
}): void => {
  if (!isDev()) {
    return;
  }

  const sectionsLabel =
    input.sections && input.sections.length > 0
      ? [...input.sections].sort().join(",")
      : "quote,profile";

  console.info(
    `[app-data] requested symbols: ${input.requestedCount}, unique: ${input.uniqueCount}, sections: ${sectionsLabel}`,
  );

  if (input.freshSkippedSymbols.length > 0) {
    console.info(
      `[app-data] fresh skipped: [${input.freshSkippedSymbols.join(", ")}]`,
    );
  }

  if (input.fetchingSymbols.length > 0) {
    console.info(`[app-data] fetching: [${input.fetchingSymbols.join(", ")}]`);
  }
};
