import axios from "axios";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_TIMEOUT_MS = 8000;

const finnhubClient = axios.create({
  baseURL: FINNHUB_BASE_URL,
  timeout: FINNHUB_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

export const getFinnhubApiKey = (): string | undefined =>
  process.env.FINNHUB_API_KEY?.trim() || undefined;

export const isFinnhubConfigured = (): boolean => Boolean(getFinnhubApiKey());

export const fetchFinnhub = async <T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> => {
  const apiKey = getFinnhubApiKey();
  if (!apiKey) {
    throw new Error("FINNHUB_API_KEY is not configured");
  }

  logFinancialDataDebug("finnhub.request", { path });

  const response = await finnhubClient.get<T>(path, {
    params: {
      ...params,
      token: apiKey,
    },
  });

  return response.data;
};
