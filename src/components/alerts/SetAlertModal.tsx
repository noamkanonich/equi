"use client";

import { Bell, CheckCircle2, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  buildSetAlertFormState,
  defaultSetAlertFormState,
  type SetAlertFormState,
  type SetAlertPriority,
  type SetAlertType,
} from "@/data/alerts/set-alert.types";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type SetAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  symbol?: string;
  initialType?: SetAlertType;
  onSaved?: (form: SetAlertFormState) => void;
};

const alertTypes: SetAlertType[] = ["price", "buyZone", "scoreChange", "earnings"];
const priorities: SetAlertPriority[] = ["high", "medium", "low"];

export const SetAlertModal = ({
  isOpen,
  onClose,
  symbol,
  initialType = "price",
  onSaved,
}: SetAlertModalProps) => {
  const t = useTranslations("interactions.setAlert");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const [form, setForm] = useState<SetAlertFormState>(defaultSetAlertFormState);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(buildSetAlertFormState(initialType));
    setIsSuccess(false);
  }, [isOpen, initialType, symbol]);

  const handleClose = () => {
    setForm(defaultSetAlertFormState);
    setIsSuccess(false);
    onClose();
  };

  const handleSave = () => {
    onSaved?.(form);
    setIsSuccess(true);
  };

  const showTargetValue =
    form.alertType === "price" || form.alertType === "buyZone" || form.alertType === "scoreChange";

  const content = isSuccess ? (
    <SuccessWrap>
      <SuccessIcon aria-hidden>
        <CheckCircle2 size={34} strokeWidth={1.8} />
      </SuccessIcon>
      <SuccessTitle>{t("success.title")}</SuccessTitle>
      <SuccessMessage>
        {symbol ? t("success.messageWithSymbol", { symbol }) : t("success.message")}
      </SuccessMessage>
      <Button onClick={handleClose}>{t("success.done")}</Button>
    </SuccessWrap>
  ) : (
    <Shell key={`${symbol ?? "alert"}-${isOpen}`}>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <Bell size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>{t("title")}</Title>
          </HeaderStart>
          <CloseButton type="button" onClick={handleClose} aria-label={t("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <Description id={descriptionId}>{t("description")}</Description>
        <FieldStack>
          {symbol ? (
            <Field>
              <Label htmlFor="set-alert-symbol">{t("fields.symbol")}</Label>
              <ReadOnlyInput id="set-alert-symbol" value={symbol} readOnly />
            </Field>
          ) : null}

          <Field>
            <Label htmlFor="set-alert-type">{t("fields.alertType")}</Label>
            <Select
              id="set-alert-type"
              value={form.alertType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  alertType: event.target.value as SetAlertType,
                }))
              }
            >
              {alertTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`types.${type}`)}
                </option>
              ))}
            </Select>
          </Field>

          {showTargetValue ? (
            <Field>
              <Label htmlFor="set-alert-target">{t("fields.targetValue")}</Label>
              <TextInput
                id="set-alert-target"
                type="text"
                inputMode="decimal"
                value={form.targetValue}
                onChange={(event) =>
                  setForm((current) => ({ ...current, targetValue: event.target.value }))
                }
                placeholder={t("fields.targetPlaceholder")}
              />
            </Field>
          ) : null}

          <Field>
            <Label htmlFor="set-alert-priority">{t("fields.priority")}</Label>
            <Select
              id="set-alert-priority"
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  priority: event.target.value as SetAlertPriority,
                }))
              }
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {t(`priorities.${priority}`)}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label htmlFor="set-alert-note">{t("fields.note")}</Label>
            <TextArea
              id="set-alert-note"
              rows={3}
              value={form.note}
              onChange={(event) =>
                setForm((current) => ({ ...current, note: event.target.value }))
              }
              placeholder={t("fields.notePlaceholder")}
            />
          </Field>
        </FieldStack>
      </Body>

      <Footer>
        <Button $variant="secondary" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button onClick={handleSave}>{t("save")}</Button>
      </Footer>
    </Shell>
  );

  const modalTitle = symbol ? t("titleWithSymbol", { symbol }) : t("title");

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
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
`;

const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const TextInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  resize: vertical;
  min-block-size: 4rem;
`;

const ReadOnlyInput = styled(TextInput)`
  background: ${({ theme }) => theme.colors.background.soft};
  cursor: default;
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
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
`;

const SuccessMessage = styled.p`
  margin: 0;
  max-inline-size: 22rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;
