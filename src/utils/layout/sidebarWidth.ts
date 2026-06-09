import { lightTheme } from "@/lib/theme/theme";

const REM_PATTERN = /^([\d.]+)rem$/;

export const parseRemToPx = (
  remValue: string,
  rootFontSizePx = 16,
): number => {
  const match = remValue.match(REM_PATTERN);
  if (!match) {
    return rootFontSizePx;
  }
  return Number.parseFloat(match[1]) * rootFontSizePx;
};

export const getRootFontSizePx = (): number => {
  if (typeof document === "undefined") {
    return 16;
  }
  const rootFontSize = getComputedStyle(document.documentElement).fontSize;
  const parsed = Number.parseFloat(rootFontSize);
  return Number.isFinite(parsed) ? parsed : 16;
};

export const getSidebarWidthBoundsPx = () => {
  const rootFontSizePx = getRootFontSizePx();
  const { layout } = lightTheme;

  return {
    defaultPx: parseRemToPx(layout.sidebarWidth, rootFontSizePx),
    minPx: parseRemToPx(layout.sidebarWidthMin, rootFontSizePx),
    maxPx: parseRemToPx(layout.sidebarWidthMax, rootFontSizePx),
  };
};

export const clampSidebarWidth = (
  widthPx: number,
  minPx: number,
  maxPx: number,
): number => Math.min(maxPx, Math.max(minPx, widthPx));

export const getSidebarResizeDelta = (
  movementX: number,
  isRtl: boolean,
): number => (isRtl ? -movementX : movementX);

export const SIDEBAR_RESIZE_KEYBOARD_STEP_PX = 8;
