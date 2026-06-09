"use client";

import { useMemo } from "react";
import { usePathname } from "@/i18n/routing";
import { resolveDashboardReplayKey } from "@/utils/motion/pathnameNavigation";

export const useDashboardMetricsReplayKey = (holdingsCount = 0) => {
  const pathname = usePathname();

  return useMemo(
    () => resolveDashboardReplayKey(pathname) + holdingsCount,
    [holdingsCount, pathname],
  );
};
