import axios from "axios";
import { buildFxRatesMatrix } from "@/data/currencies/mappers";
import type { CurrencyRatesResponse } from "@/data/currencies/currency.types";
import type { FrankfurterLatestResponse } from "./currency-api.types";

const FRANKFURTER_BASE_URL = "https://api.frankfurter.app";
const FRANKFURTER_TIMEOUT_MS = 8000;

const frankfurterClient = axios.create({
  baseURL: FRANKFURTER_BASE_URL,
  timeout: FRANKFURTER_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

export const fetchFrankfurterLatestRates =
  async (): Promise<CurrencyRatesResponse> => {
    const response = await frankfurterClient.get<FrankfurterLatestResponse>(
      "/latest",
      {
        params: {
          from: "USD",
          to: "ILS,EUR",
        },
      },
    );

    const { date, rates } = response.data;

    if (!rates.ILS || !rates.EUR) {
      throw new Error("Frankfurter response missing required currency rates");
    }

    const lastUpdated = new Date().toISOString();

    return {
      rates: buildFxRatesMatrix(rates),
      meta: {
        source: "frankfurter",
        base: "USD",
        date,
        isFallback: false,
        lastUpdated,
      },
    };
  };
