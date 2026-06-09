"use client";

import { Settings2, X } from "lucide-react";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import type { AlertSettingsTypeKey } from "@/data/settings/settings.types";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";
import { SettingsSelectField } from "./SettingsSelectField";

type AlertConfigureModalProps = {
  typeKey: AlertSettingsTypeKey | null;
  isOpen: boolean;
  onClose: () => void;
};

export const AlertConfigureModal = ({
  typeKey,
  isOpen,
  onClose,
}: AlertConfigureModalProps) => {
  const t = useTranslations("settings.alerts");
  const tModals = useTranslations("settings.alerts.modals");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);

  const [priority, setPriority] = useState("high");
  const [frequency, setFrequency] = useState("immediate");
  const [inAppChannel, setInAppChannel] = useState(true);
  const [emailChannel, setEmailChannel] = useState(true);

  if (!typeKey) {
    return null;
  }

  const typeTitle = t(`types.${typeKey}.title`);
  const modalTitle = tModals("configureTitle", { type: typeTitle });

  const content = (
    <Shell>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <Settings2 size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>{modalTitle}</Title>
          </HeaderStart>
          <CloseButton type="button" onClick={onClose} aria-label={tModals("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <FieldStack>
          <SettingsSelectField
            id={`alert-config-priority-${typeKey}`}
            label={tModals("priority")}
            value={priority}
            onChange={setPriority}
          >
            <option value="high">{t("priority.high.title")}</option>
            <option value="medium">{t("priority.medium.title")}</option>
            <option value="low">{t("priority.low.title")}</option>
            <option value="info">{t("priority.info.title")}</option>
          </SettingsSelectField>

          <SettingsSelectField
            id={`alert-config-frequency-${typeKey}`}
            label={tModals("frequency")}
            value={frequency}
            onChange={setFrequency}
          >
            <option value="immediate">{tModals("frequencyImmediate")}</option>
            <option value="daily">{tModals("frequencyDaily")}</option>
            <option value="weekly">{tModals("frequencyWeekly")}</option>
          </SettingsSelectField>

          <SettingsSelectField
            id={`alert-config-threshold-${typeKey}`}
            label={tModals("threshold")}
            value="default"
            onChange={() => undefined}
          >
            <option value="default">{tModals("thresholdDefault")}</option>
          </SettingsSelectField>

          <ChannelGroup>
            <ChannelLabel>{tModals("channels")}</ChannelLabel>
            <ChannelRow>
              <ChannelName>{t("channels.inApp.title")}</ChannelName>
              <MiniToggle
                type="button"
                $active={inAppChannel}
                aria-pressed={inAppChannel}
                onClick={() => setInAppChannel((value) => !value)}
              >
                <MiniThumb $active={inAppChannel} />
              </MiniToggle>
            </ChannelRow>
            <ChannelRow>
              <ChannelName>{t("channels.email.title")}</ChannelName>
              <MiniToggle
                type="button"
                $active={emailChannel}
                aria-pressed={emailChannel}
                onClick={() => setEmailChannel((value) => !value)}
              >
                <MiniThumb $active={emailChannel} />
              </MiniToggle>
            </ChannelRow>
          </ChannelGroup>
        </FieldStack>

        <Hint id={descriptionId}>{tModals("placeholderDescription")}</Hint>
      </Body>

      <Footer>
        <Button $variant="secondary" onClick={onClose}>
          {tModals("close")}
        </Button>
        <Button onClick={onClose}>{tModals("save")}</Button>
      </Footer>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={modalTitle}
        closeLabel={tModals("close")}
      >
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
  inline-size: min(32rem, 100%);
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChannelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ChannelLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const ChannelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ChannelName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const MiniToggle = styled.button<{ $active: boolean }>`
  inline-size: 2.75rem;
  block-size: 1.5rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.border.strong};
  cursor: pointer;
`;

const MiniThumb = styled.span<{ $active: boolean }>`
  display: block;
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.card};
  margin-inline-start: ${({ $active }) => ($active ? "1.25rem" : "0")};
  transition: margin-inline-start 0.2s ease;
`;

const Hint = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;
