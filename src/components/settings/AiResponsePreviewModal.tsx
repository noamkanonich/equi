"use client";

import { useId } from "react";
import { Eye, X } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { AiPreferencesState } from "@/data/settings/settings.types";
import {
  getAiPreviewContent,
  getAiPreviewPreferenceLabels,
} from "@/utils/settings/getAiPreviewText";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type AiResponsePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  settings: AiPreferencesState;
};

export const AiResponsePreviewModal = ({
  isOpen,
  onClose,
  settings,
}: AiResponsePreviewModalProps) => {
  const t = useTranslations("settings.aiPreferences");
  const tModals = useTranslations("settings.aiPreferences.modals");
  const tSummary = useTranslations("settings.aiPreferences.summary.values");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const preview = getAiPreviewContent(settings);
  const preferenceLabels = getAiPreviewPreferenceLabels(settings);

  const content = (
    <Shell>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <Eye size={20} strokeWidth={1.9} />
            </IconWrap>
            <TitleGroup>
              <Title id={titleId}>{tModals("previewTitle")}</Title>
              <Description id={descriptionId}>{tModals("stockLabel")}</Description>
            </TitleGroup>
          </HeaderStart>
          <CloseButton type="button" onClick={onClose} aria-label={tModals("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <InsightCard>
          <Symbol dir="ltr">{t("preview.symbol")}</Symbol>
          {preview.mode === "detailed" ? (
            <>
              <InsightText>
                {t(`preview.mock.${preview.variantKey}.intro` as "preview.mock.detailed_balanced.intro")}
              </InsightText>
              {preview.bulletKeys.map((bulletKey) => (
                <Bullet key={bulletKey}>
                  {t(
                    `preview.mock.${preview.variantKey}.${bulletKey}` as "preview.mock.detailed_balanced.bullet1",
                  )}
                </Bullet>
              ))}
            </>
          ) : (
            <InsightText>
              {t(`preview.mock.${preview.variantKey}.text` as "preview.mock.balanced_balanced.text")}
            </InsightText>
          )}
        </InsightCard>

        <PreferencesBlock>
          <PreferencesTitle>{tModals("activePreferences")}</PreferencesTitle>
          <ChipList>
            <Chip>
              {t("preview.preferenceLabels.detailLevel")}:{" "}
              {tSummary(preferenceLabels.detailLevel)}
            </Chip>
            <Chip>
              {t("preview.preferenceLabels.tone")}: {tSummary(preferenceLabels.tone)}
            </Chip>
            <Chip>
              {t("preview.preferenceLabels.riskWarnings")}:{" "}
              {preferenceLabels.riskWarnings ? tSummary("enabled") : tSummary("disabled")}
            </Chip>
            <Chip>
              {t("preview.preferenceLabels.confidence")}:{" "}
              {preferenceLabels.showConfidence ? tSummary("enabled") : tSummary("disabled")}
            </Chip>
            <Chip>
              {t("preview.preferenceLabels.downside")}:{" "}
              {preferenceLabels.showDownside ? tSummary("enabled") : tSummary("disabled")}
            </Chip>
          </ChipList>
        </PreferencesBlock>
      </Body>

      <Footer>
        <Button $variant="secondary" onClick={onClose}>
          {tModals("close")}
        </Button>
      </Footer>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={tModals("previewTitle")}
        closeLabel={tModals("close")}
      >
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

const InsightCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 16%, transparent);
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const InsightText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Bullet = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  padding-inline-start: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: "•";
    margin-inline-end: ${({ theme }) => theme.spacing.xs};
  }
`;

const PreferencesBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PreferencesTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const ChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Chip = styled.li`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column-reverse;

    & > button {
      inline-size: 100%;
    }
  }
`;
