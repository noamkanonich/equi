"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type ConfirmModalTone = "danger" | "neutral";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: ConfirmModalTone;
  successTitle?: string;
  successMessage?: string;
  children?: ReactNode;
  secondaryConfirmLabel?: string;
  onSecondaryConfirm?: () => void;
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "neutral",
  successTitle,
  successMessage,
  children,
  secondaryConfirmLabel,
  onSecondaryConfirm,
}: ConfirmModalProps) => {
  const t = useTranslations("actions");
  const theme = useTheme();
  const titleId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    if (successTitle) {
      setIsSuccess(true);
      return;
    }
    handleClose();
  };

  const handleSecondary = () => {
    onSecondaryConfirm?.();
    if (successTitle) {
      setIsSuccess(true);
      return;
    }
    handleClose();
  };

  const content = isSuccess ? (
    <SuccessWrap>
      <SuccessIcon aria-hidden>
        <CheckCircle2 size={34} strokeWidth={1.8} />
      </SuccessIcon>
      <SuccessTitle>{successTitle}</SuccessTitle>
      {successMessage ? <SuccessMessage>{successMessage}</SuccessMessage> : null}
      <Button onClick={handleClose}>{t("confirm")}</Button>
    </SuccessWrap>
  ) : (
    <Shell>
      <IconWrap $tone={tone} aria-hidden>
        <AlertTriangle size={28} strokeWidth={1.8} />
      </IconWrap>
      <Title id={titleId}>{title}</Title>
      <Description>{description}</Description>
      {children}
      <Actions>
        <Button $variant="secondary" onClick={handleClose}>
          {cancelLabel}
        </Button>
        {secondaryConfirmLabel && onSecondaryConfirm ? (
          <Button $variant="secondary" onClick={handleSecondary}>
            {secondaryConfirmLabel}
          </Button>
        ) : null}
        <Button
          onClick={handleConfirm}
          $variant={tone === "danger" ? "primary" : "primary"}
        >
          {confirmLabel}
        </Button>
      </Actions>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={handleClose} title={title} closeLabel={cancelLabel}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} labelledBy={titleId}>
      <PanelWrap>{content}</PanelWrap>
    </Modal>
  );
};

const PanelWrap = styled.div`
  inline-size: min(28rem, 100%);
  margin-inline: auto;
`;

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const IconWrap = styled.span<{ $tone: ConfirmModalTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 50%;
  color: ${({ theme, $tone }) =>
    $tone === "danger" ? theme.colors.status.negative : theme.colors.brand.primary};
  background: ${({ theme, $tone }) =>
    $tone === "danger"
      ? theme.colors.status.negativeSoft
      : theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  margin-block-start: ${({ theme }) => theme.spacing.sm};

  & > button {
    flex: 1;
    min-inline-size: 7rem;
  }
`;

const SuccessWrap = styled(Shell)``;

const SuccessIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.status.positive};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
`;

const SuccessTitle = styled(Title)`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const SuccessMessage = styled(Description)`
  max-inline-size: 22rem;
`;
