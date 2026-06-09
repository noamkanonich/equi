import axios from "axios";
import {
  getFmpLogPath,
  logFinancialDataDebug,
} from "@/lib/financial-data/devFinancialDataLog";
import { setRateLimitCooldown } from "@/lib/financial-data/stock-data-cache";
import { runWithFmpRequestSlot } from "./fmpRequestQueue";
import {
  getFmpErrorMessage,
  isFmpArrayResponse,
  isFmpErrorResponse,
} from "./fmpResponseGuards";

const FMP_TIMEOUT_MS = 8000;
const FMP_RATE_LIMIT_RETRY_MS = 600;

const fmpClient = axios.create({
  timeout: FMP_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

export class FmpApiKeyMissingError extends Error {
  constructor() {
    super("FMP_API_KEY is not configured");
    this.name = "FmpApiKeyMissingError";
  }
}

export class FmpApiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FmpApiResponseError";
  }
}

export const getFmpApiKey = (): string | undefined =>
  process.env.FMP_API_KEY?.trim() || undefined;

export const isFmpConfigured = (): boolean => Boolean(getFmpApiKey());

const fetchFmpOnce = async <T>(
  url: string,
  params: Record<string, string | number> | undefined,
  apiKey: string,
): Promise<T> => {
  const path = getFmpLogPath(url);

  const response = await fmpClient.get<T>(url, {
    params: {
      ...params,
      apikey: apiKey,
    },
  });

  const data = response.data;

  if (isFmpErrorResponse(data)) {
    const message = getFmpErrorMessage(data) ?? "FMP API error response";
    logFinancialDataDebug("fmp.fetch", {
      path,
      ok: false,
      status: response.status,
      isFmpErrorObject: true,
      errorMessage: message.slice(0, 120),
    });
    throw new FmpApiResponseError(message);
  }

  logFinancialDataDebug("fmp.fetch", {
    path,
    ok: true,
    status: response.status,
    isArray: isFmpArrayResponse(data),
    isFmpErrorObject: false,
  });

  return data;
};

const isRateLimitedError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 429;

export const fetchFmp = async <T>(
  url: string,
  params?: Record<string, string | number>,
): Promise<T> => {
  const apiKey = getFmpApiKey();
  if (!apiKey) {
    throw new FmpApiKeyMissingError();
  }

  const path = getFmpLogPath(url);

  return runWithFmpRequestSlot(async () => {
    let hasRetriedRateLimit = false;

    const execute = async (): Promise<T> => {
      try {
        return await fetchFmpOnce<T>(url, params, apiKey);
      } catch (error) {
        if (isRateLimitedError(error)) {
          setRateLimitCooldown();
          if (!hasRetriedRateLimit) {
            hasRetriedRateLimit = true;
            logFinancialDataDebug("fmp.fetch", {
              path,
              ok: false,
              status: 429,
              retrying: true,
            });
            await new Promise((resolve) => {
              setTimeout(resolve, FMP_RATE_LIMIT_RETRY_MS);
            });
            return execute();
          }
        }

        if (error instanceof FmpApiResponseError || error instanceof FmpApiKeyMissingError) {
          throw error;
        }

        const axiosError = axios.isAxiosError(error);
        logFinancialDataDebug("fmp.fetch", {
          path,
          ok: false,
          status: axiosError ? error.response?.status : undefined,
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage:
            error instanceof Error ? error.message.slice(0, 120) : "request failed",
        });

        throw error;
      }
    };

    return execute();
  });
};
