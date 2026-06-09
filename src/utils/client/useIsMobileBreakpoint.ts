"use client";

import { useEffect, useState } from "react";
import { useTheme } from "styled-components";

export const useIsMobileBreakpoint = (tabletBreakpoint: number): boolean => {
  const theme = useTheme();
  const breakpoint = tabletBreakpoint ?? theme.breakpoints.tablet;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, [breakpoint]);

  return isMobile;
};
