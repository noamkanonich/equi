const MAX_CONCURRENT_FMP_REQUESTS = 4;

let activeRequests = 0;
const waitQueue: Array<() => void> = [];

const releaseSlot = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  const next = waitQueue.shift();
  if (next) {
    next();
  }
};

export const runWithFmpRequestSlot = async <T>(task: () => Promise<T>): Promise<T> => {
  await new Promise<void>((resolve) => {
    if (activeRequests < MAX_CONCURRENT_FMP_REQUESTS) {
      activeRequests += 1;
      resolve();
      return;
    }

    waitQueue.push(() => {
      activeRequests += 1;
      resolve();
    });
  });

  try {
    return await task();
  } finally {
    releaseSlot();
  }
};
