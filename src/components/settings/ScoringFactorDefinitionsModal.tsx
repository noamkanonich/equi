"use client";

import { useId } from "react";
import { ListTree, X } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { scoringFactorKeys } from "@/data/scoring/scoring.mock";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type ScoringFactorDefinitionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ScoringFactorDefinitionsModal = ({
  isOpen,
  onClose,
}: ScoringFactorDefinitionsModalProps) => {
  const t = useTranslations("settings.scoringModel.modals.definitions");
  const tFactors = useTranslations("settings.scoringModel.factors");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);

  const content = (
    <Shell>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <ListTree size={20} strokeWidth={1.9} />
            </IconWrap>
            <TitleGroup>
              <Title id={titleId}>{t("title")}</Title>
              <Description id={descriptionId}>{t("description")}</Description>
            </TitleGroup>
          </HeaderStart>
          <CloseButton type="button" onClick={onClose} aria-label={t("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <FactorList>
          {scoringFactorKeys.map((factorKey) => (
            <FactorItem key={factorKey}>
              <FactorTitle>{tFactors(`${factorKey}.title`)}</FactorTitle>
              <FactorSummary>{tFactors(`${factorKey}.description`)}</FactorSummary>
              <FactorDetails>{tFactors(`${factorKey}.details`)}</FactorDetails>
            </FactorItem>
          ))}
        </FactorList>
      </Body>

      <Footer>
        <Button $variant="secondary" onClick={onClose}>
          {t("close")}
        </Button>
      </Footer>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title={t("title")} closeLabel={t("close")}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy={titleId} describedBy={descriptionId}>
      <PanelWrap>{content}</PanelWrap>
    </Modal>
  );
};

const PanelWrap = styled.div`
  inline-size: min(36rem, 100%);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  max-block-size: 90vh;
`;

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-block-size: 0;
  flex: 1;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const HeaderStart = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const TitleGroup = styled.div`
  min-inline-size: 0;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Description = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  flex-shrink: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  min-block-size: 0;
`;

const FactorList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FactorItem = styled.li`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const FactorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const FactorSummary = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const FactorDetails = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
`;
