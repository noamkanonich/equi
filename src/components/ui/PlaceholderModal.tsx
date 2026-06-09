"use client";

import type { LucideIcon } from "lucide-react";
import { Sparkles, X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type PlaceholderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  icon?: LucideIcon;
  children?: ReactNode;
};

export const PlaceholderModal = ({
  isOpen,
  onClose,
  title,
  description,
  primaryLabel,
  onPrimary,
  icon: Icon = Sparkles,
  children,
}: PlaceholderModalProps) => {
  const t = useTranslations("interactions.placeholder");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const bodyText = description ?? t("description");
  const primaryText = primaryLabel ?? t("close");

  const content = (
    <Shell>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <Icon size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>{title}</Title>
          </HeaderStart>
          <CloseButton type="button" onClick={onClose} aria-label={t("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <Description id={descriptionId}>{bodyText}</Description>
        {children}
      </Body>

      <Footer>
        {onPrimary ? (
          <Button $variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        ) : null}
        <Button onClick={onPrimary ?? onClose}>{primaryText}</Button>
      </Footer>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title={title} closeLabel={t("close")}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
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

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;
