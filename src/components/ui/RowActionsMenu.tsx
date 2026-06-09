"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";
import { useIsClient } from "@/utils/client/useIsClient";

const DROPDOWN_GAP_PX = 4;
const VIEWPORT_PADDING_PX = 8;

type DropdownPosition = {
  left: number;
  top: number;
};

export type RowActionItem = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

type RowActionsMenuProps = {
  actions: RowActionItem[];
  ariaLabel?: string;
  triggerSize?: "sm" | "md";
};

export const RowActionsMenu = ({
  actions,
  ariaLabel,
  triggerSize = "sm",
}: RowActionsMenuProps) => {
  const t = useTranslations("interactions.rowActions");
  const theme = useTheme();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const label = ariaLabel ?? t("menu");

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setDropdownPosition(null);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
      return;
    }

    setDropdownPosition(null);
    setIsOpen(true);
  }, [closeMenu, isOpen]);

  const updateDropdownPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const dropdown = dropdownRef.current;

    if (!trigger || !dropdown) return;

    const triggerRect = trigger.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    const direction = window.getComputedStyle(trigger).direction;
    const desiredLeft =
      direction === "rtl"
        ? triggerRect.left
        : triggerRect.right - dropdownRect.width;
    const maximumLeft =
      window.innerWidth - dropdownRect.width - VIEWPORT_PADDING_PX;
    const left = Math.min(
      Math.max(desiredLeft, VIEWPORT_PADDING_PX),
      Math.max(VIEWPORT_PADDING_PX, maximumLeft),
    );
    const belowTop = triggerRect.bottom + DROPDOWN_GAP_PX;
    const aboveTop = triggerRect.top - dropdownRect.height - DROPDOWN_GAP_PX;
    const hasRoomBelow =
      belowTop + dropdownRect.height <= window.innerHeight - VIEWPORT_PADDING_PX;
    const top = hasRoomBelow
      ? belowTop
      : Math.max(VIEWPORT_PADDING_PX, aboveTop);

    setDropdownPosition({ left, top });
  }, []);

  const handleAction = useCallback(
    (action: RowActionItem) => {
      if (action.disabled) return;
      closeMenu();
      action.onClick();
    },
    [closeMenu],
  );

  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handlePointerDown = (event: MouseEvent) => {
      const eventTarget = event.target as Node;
      const clickedTrigger = containerRef.current?.contains(eventTarget);
      const clickedDropdown = dropdownRef.current?.contains(eventTarget);

      if (!clickedTrigger && !clickedDropdown) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeMenu, isMobile, isOpen]);

  useEffect(() => {
    if (!isOpen || isMobile) return;

    updateDropdownPosition();

    const handleViewportChange = () => {
      updateDropdownPosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isMobile, isOpen, updateDropdownPosition]);

  const dropdownTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const };

  const menuItems = actions.map((action) => (
    <MenuItem
      key={action.key}
      type="button"
      $destructive={action.destructive ?? false}
      disabled={action.disabled}
      onClick={() => handleAction(action)}
    >
      {action.label}
    </MenuItem>
  ));

  const desktopDropdown =
    isClient && !isMobile
      ? createPortal(
          <AnimatePresence>
            {isOpen ? (
              <Dropdown
                ref={dropdownRef}
                id={menuId}
                role="menu"
                aria-label={label}
                $position={dropdownPosition}
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: -6, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -4, scale: 0.98 }
                }
                transition={dropdownTransition}
              >
                {menuItems}
              </Dropdown>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <Container ref={containerRef}>
      <TriggerButton
        ref={triggerRef}
        type="button"
        $size={triggerSize}
        onClick={(event) => {
          event.stopPropagation();
          toggleMenu();
        }}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup={isMobile ? "dialog" : "menu"}
        aria-controls={menuId}
      >
        <MoreVertical size={triggerSize === "sm" ? 16 : 18} strokeWidth={1.8} aria-hidden />
      </TriggerButton>

      {desktopDropdown}

      {isMobile ? (
        <BottomSheet
          isOpen={isOpen}
          onClose={closeMenu}
          title={label}
          closeLabel={t("close")}
        >
          <SheetList role="menu">{menuItems}</SheetList>
        </BottomSheet>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

const TriggerButton = styled.button<{ $size: "sm" | "md" }>`
  inline-size: ${({ $size }) => ($size === "sm" ? "2rem" : "2.25rem")};
  block-size: ${({ $size }) => ($size === "sm" ? "2rem" : "2.25rem")};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.card};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.strong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const Dropdown = styled(motion.div)<{ $position: DropdownPosition | null }>`
  position: fixed;
  top: ${({ $position }) => $position?.top ?? 0}px;
  left: ${({ $position }) => $position?.left ?? 0}px;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-inline-size: 11rem;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  visibility: ${({ $position }) => ($position ? "visible" : "hidden")};
`;

const MenuItem = styled.button<{ $destructive: boolean }>`
  display: block;
  inline-size: 100%;
  text-align: start;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme, $destructive }) =>
    $destructive ? theme.colors.status.negative : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.soft};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 1px;
  }
`;

const SheetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
