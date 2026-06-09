"use client";

import { CheckCircle2, FileText, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  defaultStockNoteFormState,
  defaultStockThesisFormState,
  type StockNoteCategory,
  type StockNoteFormState,
  type StockNoteModalMode,
  type StockThesisFormState,
} from "@/data/stocks/stock-note.types";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type StockNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  symbol?: string;
  mode?: StockNoteModalMode;
  initialNote?: StockNoteFormState;
  initialThesis?: StockThesisFormState;
  initialHoldingNotes?: string;
  onSaved?: (payload: {
    mode: StockNoteModalMode;
    note?: StockNoteFormState;
    thesis?: StockThesisFormState;
    holdingNotes?: string;
  }) => void;
};

const categories: StockNoteCategory[] = ["thesis", "watch", "risk", "general"];

export const StockNoteModal = ({
  isOpen,
  onClose,
  symbol,
  mode = "note",
  initialNote,
  initialThesis,
  initialHoldingNotes = "",
  onSaved,
}: StockNoteModalProps) => {
  const t = useTranslations("interactions.stockNote");
  const tNotes = useTranslations("notes.modal");
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);
  const [form, setForm] = useState<StockNoteFormState>(defaultStockNoteFormState);
  const [thesisForm, setThesisForm] = useState<StockThesisFormState>(defaultStockThesisFormState);
  const [holdingNotes, setHoldingNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialNote ?? defaultStockNoteFormState);
    setThesisForm(initialThesis ?? defaultStockThesisFormState);
    setHoldingNotes(initialHoldingNotes);
    setIsSuccess(false);
  }, [isOpen, initialNote, initialThesis, initialHoldingNotes, symbol]);

  const handleClose = () => {
    setForm(defaultStockNoteFormState);
    setThesisForm(defaultStockThesisFormState);
    setHoldingNotes("");
    setIsSuccess(false);
    onClose();
  };

  const handleSave = () => {
    if (mode === "thesis") {
      onSaved?.({ mode, thesis: thesisForm });
    } else if (mode === "holding" || mode === "watchlist") {
      onSaved?.({ mode, holdingNotes });
    } else {
      onSaved?.({ mode, note: form });
    }
    setIsSuccess(true);
  };

  const modalTitle =
    mode === "thesis"
      ? symbol
        ? tNotes("thesisTitleWithSymbol", { symbol })
        : tNotes("thesisTitle")
      : symbol
        ? t("titleWithSymbol", { symbol })
        : t("title");

  const content = isSuccess ? (
    <SuccessWrap>
      <SuccessIcon aria-hidden>
        <CheckCircle2 size={34} strokeWidth={1.8} />
      </SuccessIcon>
      <SuccessTitle>{tNotes("success")}</SuccessTitle>
      <SuccessMessage>
        {symbol ? t("success.messageWithSymbol", { symbol }) : t("success.message")}
      </SuccessMessage>
      <Button onClick={handleClose}>{t("success.done")}</Button>
    </SuccessWrap>
  ) : (
    <Shell key={`${symbol ?? "note"}-${mode}-${isOpen}`}>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <FileText size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>{modalTitle}</Title>
          </HeaderStart>
          <CloseButton type="button" onClick={handleClose} aria-label={t("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <Description id={descriptionId}>
          {mode === "thesis" ? tNotes("thesisDescription") : t("description")}
        </Description>

        {mode === "thesis" ? (
          <FieldStack>
            <Field>
              <Label htmlFor="thesis-why">{tNotes("whyIOwnIt")}</Label>
              <TextArea
                id="thesis-why"
                rows={3}
                value={thesisForm.whyIOwnIt}
                onChange={(event) =>
                  setThesisForm((current) => ({
                    ...current,
                    whyIOwnIt: event.target.value,
                  }))
                }
                placeholder={tNotes("whyIOwnItPlaceholder")}
              />
            </Field>
            <Field>
              <Label htmlFor="thesis-watch">{tNotes("whatToWatch")}</Label>
              <TextArea
                id="thesis-watch"
                rows={3}
                value={thesisForm.whatToWatch}
                onChange={(event) =>
                  setThesisForm((current) => ({
                    ...current,
                    whatToWatch: event.target.value,
                  }))
                }
                placeholder={tNotes("whatToWatchPlaceholder")}
              />
            </Field>
            <Field>
              <Label htmlFor="thesis-sell">{tNotes("sellIf")}</Label>
              <TextArea
                id="thesis-sell"
                rows={3}
                value={thesisForm.sellIf}
                onChange={(event) =>
                  setThesisForm((current) => ({
                    ...current,
                    sellIf: event.target.value,
                  }))
                }
                placeholder={tNotes("sellIfPlaceholder")}
              />
            </Field>
          </FieldStack>
        ) : mode === "holding" || mode === "watchlist" ? (
          <FieldStack>
            <Field>
              <Label htmlFor="holding-note">{tNotes("note")}</Label>
              <TextArea
                id="holding-note"
                rows={5}
                value={holdingNotes}
                onChange={(event) => setHoldingNotes(event.target.value)}
                placeholder={t("fields.notePlaceholder")}
              />
            </Field>
          </FieldStack>
        ) : (
          <FieldStack>
            <Field>
              <Label htmlFor="stock-note-title">{t("fields.title")}</Label>
              <TextInput
                id="stock-note-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder={t("fields.titlePlaceholder")}
              />
            </Field>

            <Field>
              <Label htmlFor="stock-note-category">{t("fields.category")}</Label>
              <Select
                id="stock-note-category"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value as StockNoteCategory,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {t(`categories.${category}`)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="stock-note-body">{t("fields.note")}</Label>
              <TextArea
                id="stock-note-body"
                rows={5}
                value={form.note}
                onChange={(event) =>
                  setForm((current) => ({ ...current, note: event.target.value }))
                }
                placeholder={t("fields.notePlaceholder")}
              />
            </Field>
          </FieldStack>
        )}
      </Body>

      <Footer>
        <Button $variant="secondary" onClick={handleClose}>
          {tNotes("cancel")}
        </Button>
        <Button onClick={handleSave}>{tNotes("save")}</Button>
      </Footer>
    </Shell>
  );

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
  min-block-size: 6rem;
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
