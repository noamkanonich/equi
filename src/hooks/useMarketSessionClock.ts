"use client";

import { useEffect, useState } from "react";
import { getMarketSessionClock } from "@/utils/market/getMarketSessionClock";

export const useMarketSessionClock = (locale: string) => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  if (!now) {
    return null;
  }

  return getMarketSessionClock(now, locale);
};
