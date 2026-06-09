"use client";

import {
  BarChart3,
  Bell,
  FileText,
  GitCompare,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import type { StockQuickActionKind } from "@/data/stocks/stock-analysis.types";
import { Link } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import { getSecFilingsUrl } from "@/utils/stocks/getSecFilingsUrl";
import { getSuggestedCompetitors } from "@/utils/stocks/getSuggestedCompetitors";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { StockNoteModal } from "./StockNoteModal";

const ACTION_ICONS: Record<
  StockQuickActionKind,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  setPriceAlert: Bell,
  addNote: FileText,
  compareCompetitors: GitCompare,
  viewSecFilings: BarChart3,
  optionsChain: TrendingUp,
};

const ACTION_KEYS: StockQuickActionKind[] = [
  "setPriceAlert",
  "addNote",
  "compareCompetitors",
  "viewSecFilings",
  "optionsChain",
];

type StockQuickActionsCardProps = {
  symbol: string;
};

export const StockQuickActionsCard = ({ symbol }: StockQuickActionsCardProps) => {
  const t = useTranslations("stockAnalysis");
  const tPlaceholders = useTranslations("placeholders");
  const { addUserAlert, addStockGeneralNote, getStockGeneralNotes } = useAppData();
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState<{
    title: string;
    description: string;
    competitors?: string[];
  } | null>(null);

  const normalizedSymbol = symbol.trim().toUpperCase();
  const competitors = getSuggestedCompetitors(normalizedSymbol);
  const latestGeneralNote = getStockGeneralNotes(normalizedSymbol)[0];
  const initialGeneralNote = latestGeneralNote
    ? {
        title: latestGeneralNote.title,
        note: latestGeneralNote.note,
        category: latestGeneralNote.category,
      }
    : undefined;

  const handleAction = (action: StockQuickActionKind) => {
    if (action === "setPriceAlert") {
      setIsSetAlertOpen(true);
      return;
    }
    if (action === "addNote") {
      setIsNoteOpen(true);
      return;
    }
    if (action === "compareCompetitors") {
      setPlaceholder({
        title: tPlaceholders("compare.title"),
        description: tPlaceholders("compare.description"),
        competitors,
      });
      return;
    }
    if (action === "viewSecFilings") {
      const url = getSecFilingsUrl(normalizedSymbol);
      if (url && typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        setPlaceholder({
          title: tPlaceholders("secFilings.title"),
          description: tPlaceholders("secFilings.description"),
        });
      }
      return;
    }
    if (action === "optionsChain") {
      setPlaceholder({
        title: tPlaceholders("optionsChain.title"),
        description: tPlaceholders("optionsChain.description"),
      });
    }
  };

  return (
    <>
      <Card>
        <Header>
          <Title>{t("quickActions.title")}</Title>
        </Header>
        <ActionList>
          {ACTION_KEYS.map((action) => {
            const Icon = ACTION_ICONS[action];
            return (
              <ActionItem key={action} type="button" onClick={() => handleAction(action)}>
                <IconWrap aria-hidden>
                  <Icon size={16} strokeWidth={1.8} />
                </IconWrap>
                {t(`actions.${action}`)}
              </ActionItem>
            );
          })}
        </ActionList>
      </Card>

      <SetAlertModal
        isOpen={isSetAlertOpen}
        onClose={() => setIsSetAlertOpen(false)}
        symbol={normalizedSymbol}
        initialType="price"
        onSaved={(form) =>
          addUserAlert({
            symbol: normalizedSymbol,
            form,
          })
        }
      />

      <StockNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        symbol={normalizedSymbol}
        mode="note"
        initialNote={initialGeneralNote}
        onSaved={({ note }) => {
          if (note) {
            addStockGeneralNote(normalizedSymbol, note);
          }
        }}
      />

      <PlaceholderModal
        isOpen={placeholder !== null}
        onClose={() => setPlaceholder(null)}
        title={placeholder?.title ?? ""}
        description={placeholder?.description}
      >
        {placeholder?.competitors?.length ? (
          <CompetitorList>
            {placeholder.competitors.map((competitor) => (
              <CompetitorLink key={competitor} href={getStockHref(competitor)} dir="ltr">
                {competitor}
              </CompetitorLink>
            ))}
          </CompetitorList>
        ) : null}
      </PlaceholderModal>
    </>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  text-align: start;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }
`;

const IconWrap = styled.span`
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const CompetitorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.md};
`;

const CompetitorLink = styled(Link)`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  }
`;
