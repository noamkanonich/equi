"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useIsClient } from "@/utils/client/useIsClient";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy: string;
  describedBy?: string;
  closeOnOverlayClick?: boolean;
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  labelledBy,
  describedBy,
  closeOnOverlayClick = true,
}: ModalProps) => {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();

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
    : { duration: 0.22, ease: "easeOut" as const };

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <ModalRoot role="presentation">
          <Overlay
            key="modal-overlay"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={transition}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden
          />
          <Panel
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: 10, scale: 0.985 }
            }
            transition={transition}
          >
            {children}
          </Panel>
        </ModalRoot>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

const ModalRoot = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  pointer-events: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const Overlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay.scrim};
  backdrop-filter: blur(6px);
  pointer-events: auto;
`;

const Panel = styled(motion.div)`
  position: relative;
  inline-size: min(70rem, 100%);
  max-block-size: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  pointer-events: auto;
`;
