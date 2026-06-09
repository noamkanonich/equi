import "server-only";

export class TaseProviderError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TaseProviderError";
    this.status = status;
  }
}

const getTaseApiKey = (): string => {
  const apiKey = process.env.TASE_API_KEY?.trim();
  if (!apiKey) {
    throw new TaseProviderError("Missing TASE_API_KEY");
  }
  return apiKey;
};

const getTaseApiKeyHeaderName = (): string =>
  process.env.TASE_API_KEY_HEADER_NAME?.trim() || "apikey";

const getTaseAcceptLanguage = (): string =>
  process.env.TASE_ACCEPT_LANGUAGE?.trim() || "en-US";

const getTaseErrorMessage = (status: number): string => {
  if (status === 401 || status === 403) {
    return "TASE request unauthorized. Check TASE_API_KEY and subscription product access.";
  }

  if (status === 429) {
    return "TASE rate limit reached.";
  }

  return `TASE request failed with status ${status}.`;
};

export const fetchTaseJson = async (url: string): Promise<unknown> => {
  if (!url.trim()) {
    throw new TaseProviderError("Missing TASE endpoint URL");
  }

  const apiKey = getTaseApiKey();
  const apiKeyHeaderName = getTaseApiKeyHeaderName();

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        [apiKeyHeaderName]: apiKey,
        Accept: "application/json",
        "accept-language": getTaseAcceptLanguage(),
      },
      next: { revalidate: 0 },
    });
  } catch (error) {
    throw new TaseProviderError(
      error instanceof Error ? error.message : "TASE network request failed",
    );
  }

  if (!response.ok) {
    throw new TaseProviderError(getTaseErrorMessage(response.status), response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new TaseProviderError("TASE response was not valid JSON", response.status);
  }
};
