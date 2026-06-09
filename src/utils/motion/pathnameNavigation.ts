let leavingPathname: string | null = null;
let replayKeyCounter = 0;

export const setLeavingPathname = (pathname: string) => {
  leavingPathname = pathname;
};

export const resolveDashboardReplayKey = (pathname: string): number => {
  if (pathname !== "/") {
    return replayKeyCounter;
  }

  if (leavingPathname !== null && leavingPathname !== "/") {
    replayKeyCounter += 1;
    leavingPathname = null;
  }

  return replayKeyCounter;
};
