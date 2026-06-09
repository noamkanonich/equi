import "server-only";

import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import {
  isYahooScrapeUrl,
  parseRetryAfterMs,
  runWithYahooScrapeSlot,
} from "@/lib/financial-data/quotes/scrapers/yahooScrapeQueue";

const SCRAPE_TIMEOUT_MS = 10_000;
const RATE_LIMIT_RETRY_DELAY_MS = 4_000;

const SCRAPE_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const JSON_FETCH_HEADERS: Record<string, string> = {
  "User-Agent": SCRAPE_HEADERS["User-Agent"],
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": SCRAPE_HEADERS["Accept-Language"],
};

const BLOCKED_STATUS_CODES = new Set([401, 403]);
const RETRYABLE_STATUS_CODES = new Set([429]);

const BLOCKED_HTML_PATTERNS = [
  /captcha/i,
  /unusual traffic/i,
  /consent\.google\.com/i,
  /consent-layer/i,
  /dmi_consent/i,
  /privacy preferences/i,
  /העדפות הפרטיות/i,
  /enable javascript/i,
  /access denied/i,
  /robot check/i,
];

const isBlockedHtml = (html: string): boolean =>
  BLOCKED_HTML_PATTERNS.some((pattern) => pattern.test(html));

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

type FetchAttemptResult<T> = {
  value: T | null;
  status?: number;
  retryAfterMs?: number;
};

const requestWithResponse = async (
  url: string,
  headers: Record<string, string>,
): Promise<Response | null> => {
  try {
    return await fetch(url, {
      headers,
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    logFinancialDataDebug("scraper.fetchError", {
      url,
      errorMessage: error instanceof Error ? error.message.slice(0, 120) : "fetch failed",
    });
    return null;
  }
};

const fetchWithRateLimitRetry = async <T>({
  url,
  headers,
  parse,
}: {
  url: string;
  headers: Record<string, string>;
  parse: (response: Response) => Promise<T | null>;
}): Promise<T | null> => {
  const executeAttempt = async (): Promise<FetchAttemptResult<T>> => {
    const response = await requestWithResponse(url, headers);

    if (!response) {
      return { value: null };
    }

    if (BLOCKED_STATUS_CODES.has(response.status)) {
      logFinancialDataDebug("scraper.blocked", {
        url,
        status: response.status,
      });
      return { value: null, status: response.status };
    }

    if (RETRYABLE_STATUS_CODES.has(response.status)) {
      const retryAfterMs =
        parseRetryAfterMs(response.headers.get("retry-after")) ?? RATE_LIMIT_RETRY_DELAY_MS;

      logFinancialDataDebug("scraper.rateLimited", {
        url,
        status: response.status,
        retryAfterMs,
      });

      return { value: null, status: response.status, retryAfterMs };
    }

    if (!response.ok) {
      logFinancialDataDebug("scraper.fetchFailed", {
        url,
        status: response.status,
      });
      return { value: null, status: response.status };
    }

    return { value: await parse(response), status: response.status };
  };

  const firstAttempt = await executeAttempt();

  if (firstAttempt.value !== null) {
    return firstAttempt.value;
  }

  if (firstAttempt.status !== 429) {
    return null;
  }

  const retryDelayMs = firstAttempt.retryAfterMs ?? RATE_LIMIT_RETRY_DELAY_MS;
  await sleep(retryDelayMs);

  const secondAttempt = await executeAttempt();

  if (secondAttempt.status === 429) {
    logFinancialDataDebug("scraper.blocked", {
      url,
      status: 429,
      reason: "rate_limit_exhausted",
    });
  }

  return secondAttempt.value;
};

const runScrapeRequest = async <T>(
  url: string,
  task: () => Promise<T | null>,
): Promise<T | null> => {
  if (isYahooScrapeUrl(url)) {
    return runWithYahooScrapeSlot(task);
  }

  return task();
};

export const fetchHtml = async (url: string): Promise<string | null> =>
  runScrapeRequest(url, async () =>
    fetchWithRateLimitRetry({
      url,
      headers: SCRAPE_HEADERS,
      parse: async (response) => {
        const html = await response.text();

        if (isBlockedHtml(html)) {
          logFinancialDataDebug("scraper.blocked", {
            url,
            reason: "blocked_html",
          });
          return null;
        }

        return html;
      },
    }),
  );

export const fetchJson = async <T>(url: string): Promise<T | null> =>
  runScrapeRequest(url, async () =>
    fetchWithRateLimitRetry({
      url,
      headers: JSON_FETCH_HEADERS,
      parse: async (response) => (await response.json()) as T,
    }),
  );
