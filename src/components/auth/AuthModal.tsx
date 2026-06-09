"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import styled, { useTheme } from "styled-components";
import { AuthForm } from "@/components/auth/AuthForm";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Modal } from "@/components/ui/Modal";
import type { AuthMode } from "@/data/auth/auth.types";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
};

export const AuthModal = ({ isOpen, onClose, initialMode = "signIn" }: AuthModalProps) => {
  const t = useTranslations("auth");
  const tSuccess = useTranslations("auth.success");
  const theme = useTheme();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const titleId = useId();
  const descriptionId = useId();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClose = () => {
    setSuccessMessage(null);
    setMode(initialMode);
    onClose();
  };

  const content = successMessage ? (
    <SuccessState>
      <SuccessMessage role="status">{successMessage}</SuccessMessage>
      <CloseSuccessButton type="button" onClick={handleClose}>
        {t("close")}
      </CloseSuccessButton>
    </SuccessState>
  ) : (
    <AuthForm
      mode={mode}
      onModeChange={setMode}
      onSuccess={() => {
        setSuccessMessage(
          mode === "signIn" ? tSuccess("signedIn") : tSuccess("signedUp"),
        );
        window.setTimeout(handleClose, 1200);
      }}
      onEmailConfirmationRequired={() => {
        setSuccessMessage(tSuccess("confirmEmail"));
      }}
    />
  );

  const title = mode === "signIn" ? t("signIn") : t("createAccount");

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={successMessage ? t("createAccount") : title}
        closeLabel={t("close")}
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle id={titleId}>
            {successMessage ? t("createAccount") : title}
          </DialogTitle>
        </DialogHeader>
        <DialogBody id={descriptionId}>{content}</DialogBody>
      </DialogContent>
    </Modal>
  );
};

const DialogContent = styled.div`
  inline-size: min(100%, 24rem);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const DialogHeader = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const DialogTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DialogBody = styled.div``;

const SuccessState = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;
`;

const SuccessMessage = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  text-align: center;
`;

const CloseSuccessButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
