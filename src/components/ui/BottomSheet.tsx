"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useIsClient } from "@/utils/client/useIsClient";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
};

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  closeLabel,
  children,
}: BottomSheetProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" as const };

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <SheetRoot role="presentation">
          <Overlay
            key="bottom-sheet-overlay"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={transition}
            onClick={onClose}
            aria-hidden
          />
          <SheetPanel
            key="bottom-sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bottom-sheet-title"
            initial={prefersReducedMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={prefersReducedMotion ? undefined : { y: "100%" }}
            transition={transition}
          >
            <SheetHandle aria-hidden />
            <SheetHeader>
              <SheetTitle id="bottom-sheet-title">{title}</SheetTitle>
              <CloseButton type="button" onClick={onClose} aria-label={closeLabel}>
                <X size={20} strokeWidth={1.75} aria-hidden />
              </CloseButton>
            </SheetHeader>
            <SheetBody>{children}</SheetBody>
          </SheetPanel>
        </SheetRoot>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

const SheetRoot = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.bottomSheet};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
`;

const Overlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay.scrim};
  pointer-events: auto;
`;

const SheetPanel = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 100vw;
  max-height: 85vh;
  background: ${({ theme }) => theme.colors.background.card};
  border-start-start-radius: ${({ theme }) => theme.radius.xl};
  border-start-end-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  overflow: hidden;
`;

const SheetHandle = styled.div`
  width: 2.5rem;
  height: 0.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.border.strong};
  margin: ${({ theme }) => theme.spacing.sm} auto 0;
  flex-shrink: 0;
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  padding-block-start: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const SheetTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: start;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const SheetBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  padding-block-end: calc(
    ${({ theme }) => theme.spacing.lg} + env(safe-area-inset-bottom, 0px)
  );
  overflow-y: auto;
`;
