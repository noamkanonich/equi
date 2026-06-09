"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  clampSidebarWidth,
  getSidebarResizeDelta,
  SIDEBAR_RESIZE_KEYBOARD_STEP_PX,
} from "@/utils/layout/sidebarWidth";

type SidebarResizeHandleProps = {
  enabled: boolean;
  widthPx: number;
  minPx: number;
  maxPx: number;
  onWidthChange: (widthPx: number) => void;
  onResetWidth: () => void;
  onResizingChange?: (isResizing: boolean) => void;
};

export const SidebarResizeHandle = ({
  enabled,
  widthPx,
  minPx,
  maxPx,
  onWidthChange,
  onResetWidth,
  onResizingChange,
}: SidebarResizeHandleProps) => {
  const t = useTranslations("shell");
  const locale = useLocale();
  const isRtl = locale === "he";
  const startWidthRef = useRef(widthPx);
  const [isResizing, setIsResizing] = useState(false);

  const setResizing = useCallback(
    (resizing: boolean) => {
      setIsResizing(resizing);
      onResizingChange?.(resizing);
    },
    [onResizingChange],
  );

  const applyWidth = useCallback(
    (nextWidthPx: number) => {
      onWidthChange(clampSidebarWidth(nextWidthPx, minPx, maxPx));
    },
    [maxPx, minPx, onWidthChange],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || event.button !== 0) {
        return;
      }

      event.preventDefault();
      startWidthRef.current = widthPx;
      setResizing(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [enabled, setResizing, widthPx],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isResizing) {
        return;
      }

      const delta = getSidebarResizeDelta(event.movementX, isRtl);
      applyWidth(startWidthRef.current + delta);
      startWidthRef.current = clampSidebarWidth(
        startWidthRef.current + delta,
        minPx,
        maxPx,
      );
    },
    [applyWidth, isResizing, isRtl, maxPx, minPx],
  );

  const endResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isResizing) {
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setResizing(false);
    },
    [isResizing, setResizing],
  );

  const handleDoubleClick = useCallback(() => {
    if (!enabled) {
      return;
    }
    onResetWidth();
  }, [enabled, onResetWidth]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!enabled) {
        return;
      }

      const widenKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const narrowKey = isRtl ? "ArrowRight" : "ArrowLeft";

      if (event.key === widenKey) {
        event.preventDefault();
        applyWidth(widthPx + SIDEBAR_RESIZE_KEYBOARD_STEP_PX);
        return;
      }

      if (event.key === narrowKey) {
        event.preventDefault();
        applyWidth(widthPx - SIDEBAR_RESIZE_KEYBOARD_STEP_PX);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        applyWidth(minPx);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        applyWidth(maxPx);
      }
    },
    [applyWidth, enabled, isRtl, maxPx, minPx, widthPx],
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    return () => {
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing]);

  if (!enabled) {
    return null;
  }

  return (
    <Handle
      role="separator"
      aria-orientation="vertical"
      aria-label={t("resizeSidebar")}
      aria-valuemin={minPx}
      aria-valuemax={maxPx}
      aria-valuenow={widthPx}
      tabIndex={0}
      $isResizing={isResizing}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endResize}
      onPointerCancel={endResize}
      onLostPointerCapture={endResize}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
    />
  );
};

const Handle = styled.div<{ $isResizing: boolean }>`
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  width: 0.5rem;
  transform: translateX(50%);
  html[dir="rtl"] & {
    transform: translateX(-50%);
  }
  z-index: 2;
  cursor: col-resize;
  touch-action: none;

  &::before {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline: 0;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: transparent;
    transition: background 0.18s ease;
  }

  &:hover::before,
  &:focus-visible::before {
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 22%,
      transparent
    );
  }

  ${({ $isResizing, theme }) =>
    $isResizing &&
    css`
      &::before {
        background: color-mix(
          in srgb,
          ${theme.colors.brand.primary} 18%,
          transparent
        );
      }
    `}

  &:focus-visible {
    outline: none;
  }
`;
