import "server-only";

const MIN_YAHOO_REQUEST_INTERVAL_MS = 1_500;

let lastYahooRequestAt = 0;
let activeYahooRequests = 0;
const yahooWaitQueue: Array<() => void> = [];

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const releaseYahooSlot = (): void => {
  activeYahooRequests = Math.max(0, activeYahooRequests - 1);
  const next = yahooWaitQueue.shift();

  if (next) {
    next();
  }
};

const waitForYahooSlot = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    if (activeYahooRequests < 1) {
      activeYahooRequests += 1;
      resolve();
      return;
    }

    yahooWaitQueue.push(() => {
      activeYahooRequests += 1;
      resolve();
    });
  });

  const elapsed = Date.now() - lastYahooRequestAt;
  const waitMs = MIN_YAHOO_REQUEST_INTERVAL_MS - elapsed;

  if (waitMs > 0) {
    await sleep(waitMs);
  }
};

export const isYahooScrapeUrl = (url: string): boolean =>
  /(^https?:\/\/)?(query[12]\.)?finance\.yahoo\.com/i.test(url);

export const parseRetryAfterMs = (retryAfterHeader: string | null): number | null => {
  if (!retryAfterHeader) {
    return null;
  }

  const seconds = Number.parseInt(retryAfterHeader, 10);

  if (Number.isFinite(seconds) && seconds > 0) {
    return seconds * 1000;
  }

  const retryDate = Date.parse(retryAfterHeader);

  if (Number.isFinite(retryDate)) {
    return Math.max(0, retryDate - Date.now());
  }

  return null;
};

export const runWithYahooScrapeSlot = async <T>(task: () => Promise<T>): Promise<T> => {
  await waitForYahooSlot();

  try {
    lastYahooRequestAt = Date.now();
    return await task();
  } finally {
    releaseYahooSlot();
  }
};
