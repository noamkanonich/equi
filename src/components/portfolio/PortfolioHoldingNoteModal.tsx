"use client";

import { CheckCircle2, FileText, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { PortfolioHolding } from "@/data/portfolio/portfolio.types";
import { useAppData } from "@/providers/useAppData";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type PortfolioHoldingNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  holding: PortfolioHolding | null;
};

export const PortfolioHoldingNoteModal = ({
  isOpen,
  onClose,
  holding,
}: PortfolioHoldingNoteModalProps) => {
  const t = useTranslations("portfolio");
  const theme = useTheme();
  const titleId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const { updatePortfolioHoldingNotes } = useAppData();

  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && holding) {
      setNotes(holding.notes ?? "");
      setIsSuccess(false);
    }
  }, [isOpen, holding]);

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const handleSave = () => {
    if (!holding) return;
    updatePortfolioHoldingNotes(holding.id, notes);
    setIsSuccess(true);
  };

  if (!holding) {
    return null;
  }

  const content = isSuccess ? (
    <SuccessWrap>
      <SuccessIcon aria-hidden>
        <CheckCircle2 size={34} strokeWidth={1.8} />
      </SuccessIcon>
      <SuccessTitle>{t("success.noteSaved")}</SuccessTitle>
      <Button onClick={handleClose}>{t("form.save")}</Button>
    </SuccessWrap>
  ) : (
    <Shell>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <FileText size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>
              {t("actions.addNote")} — {holding.symbol}
            </Title>
          </HeaderStart>
          <CloseButton type="button" onClick={handleClose} aria-label={t("form.cancel")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}
      <Body>
        <Label htmlFor="holding-note-body">{t("form.notes")}</Label>
        <TextArea
          id="holding-note-body"
          rows={5}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </Body>
      <Footer>
        <Button $variant="secondary" onClick={handleClose}>
          {t("form.cancel")}
        </Button>
        <Button onClick={handleSave}>{t("form.save")}</Button>
      </Footer>
    </Shell>
  );

  const modalTitle = `${t("actions.addNote")} — ${holding.symbol}`;

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        closeLabel={t("form.cancel")}
      >
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
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const HeaderStart = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-block-end: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const TextArea = styled.textarea`
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  resize: vertical;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const SuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const SuccessIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 4rem;
  block-size: 4rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
`;

const SuccessTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;
