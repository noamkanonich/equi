"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";
import { useAppData } from "@/providers/useAppData";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type RemoveHoldingConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  holding: EnrichedPortfolioHolding | null;
};

export const RemoveHoldingConfirmModal = ({
  isOpen,
  onClose,
  holding,
}: RemoveHoldingConfirmModalProps) => {
  const t = useTranslations("portfolio.remove");
  const tSuccess = useTranslations("portfolio.success");
  const theme = useTheme();
  const titleId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const { removePortfolioHolding } = useAppData();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!holding) return;
    removePortfolioHolding(holding.id);
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
      <SuccessTitle>{tSuccess("removed")}</SuccessTitle>
      <Button onClick={handleClose}>{t("confirm")}</Button>
    </SuccessWrap>
  ) : (
    <Shell>
      <IconWrap aria-hidden>
        <AlertTriangle size={28} strokeWidth={1.8} />
      </IconWrap>
      <Title id={titleId}>{t("title")}</Title>
      <Description>
        {t("description", { symbol: holding.symbol, companyName: holding.companyName })}
      </Description>
      <Actions>
        <Button $variant="secondary" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button onClick={handleConfirm}>
          {t("confirm")}
        </Button>
      </Actions>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={t("title")}
        closeLabel={t("cancel")}
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
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.status.negative};
  background: ${({ theme }) => theme.colors.status.negativeSoft};
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

const SuccessIcon = styled(IconWrap)`
  color: ${({ theme }) => theme.colors.status.positive};
  background: ${({ theme }) => theme.colors.status.positiveSoft};
`;

const SuccessTitle = styled(Title)`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
