"use client";

import { Check, Save } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";

type SettingsFooterActionsProps = {
  saveStatus: "idle" | "saved";
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
  saveDisabledMessage?: string;
};

export const SettingsFooterActions = ({
  saveStatus,
  onSave,
  onCancel,
  saveDisabled = false,
  saveDisabledMessage,
}: SettingsFooterActionsProps) => {
  const t = useTranslations("settings");
  const prefersReducedMotion = useReducedMotion();
  const isSaveDisabled = saveDisabled || saveStatus === "saved";

  return (
    <FooterWrap>
      {saveDisabledMessage ? (
        <SaveHint role="status">{saveDisabledMessage}</SaveHint>
      ) : null}
      <Footer>
        <Button $variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <SaveButton
          $variant="primary"
          onClick={onSave}
          disabled={isSaveDisabled}
          aria-live="polite"
        >
        <AnimatePresence mode="wait" initial={false}>
          {saveStatus === "saved" ? (
            <ButtonContent
              key="saved"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <Check size={16} strokeWidth={2} aria-hidden />
              {t("saved")}
            </ButtonContent>
          ) : (
            <ButtonContent
              key="save"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <Save size={16} strokeWidth={1.9} aria-hidden />
              {t("saveChanges")}
            </ButtonContent>
          )}
        </AnimatePresence>
      </SaveButton>
      </Footer>
    </FooterWrap>
  );
};

const FooterWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SaveHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    text-align: start;
  }
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block-start: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column-reverse;
    align-items: stretch;
    position: sticky;
    inset-block-end: 0;
    padding: ${({ theme }) => theme.spacing.md};
    margin-inline: calc(-1 * ${({ theme }) => theme.spacing.md});
    background: ${({ theme }) => theme.colors.background.app};
    border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
    z-index: 5;
  }
`;

const SaveButton = styled(Button)`
  min-inline-size: 9rem;
`;

const ButtonContent = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
