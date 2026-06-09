import "server-only";

export const TASE_ASSETS_CACHE_KEY = "tase_assets_cache_v2";

export const TASE_DEFAULT_SECURITIES_BASIC_URL =
  "https://datawise.tase.co.il/v1/basic-securities/companies-list";

export const TASE_DEFAULT_INDICES_BASIC_URL =
  "https://datawise.tase.co.il/api/v2/basic-indices/indices-list";

export const TASE_DEFAULT_FUNDS_BASIC_URL =
  "https://datawise.tase.co.il/v1/fund/fund-list";

export const getTaseEndpointUrl = (
  envName:
    | "TASE_SECURITIES_BASIC_URL"
    | "TASE_INDICES_BASIC_URL"
    | "TASE_FUNDS_BASIC_URL",
): string => {
  const configured = process.env[envName]?.trim();
  if (configured) {
    return configured;
  }

  if (envName === "TASE_SECURITIES_BASIC_URL") {
    return TASE_DEFAULT_SECURITIES_BASIC_URL;
  }

  if (envName === "TASE_INDICES_BASIC_URL") {
    return TASE_DEFAULT_INDICES_BASIC_URL;
  }

  return TASE_DEFAULT_FUNDS_BASIC_URL;
};
