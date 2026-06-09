"use client";

import { BriefcaseBusiness, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { AddStockDestination } from "@/data/add-stock/add-stock.types";

type AddStockDestinationPanelProps = {
  destination: AddStockDestination;
  onChange: (destination: AddStockDestination) => void;
};

export const AddStockDestinationPanel = ({
  destination,
  onChange,
}: AddStockDestinationPanelProps) => {
  const t = useTranslations("addStock");

  return (
    <Panel>
      <Title>{t("destination.title")}</Title>
      <Helper>{t("destination.helper")}</Helper>
      <Options role="radiogroup" aria-label={t("destination.title")}>
        <Option
          type="button"
          role="radio"
          aria-checked={destination === "portfolio"}
          $selected={destination === "portfolio"}
          onClick={() => onChange("portfolio")}
        >
          <IconWrap $selected={destination === "portfolio"}>
            <BriefcaseBusiness size={18} strokeWidth={1.8} aria-hidden />
          </IconWrap>
          <OptionText>
            <OptionTitle>{t("destination.portfolio.title")}</OptionTitle>
            <OptionDescription>
              {t("destination.portfolio.description")}
            </OptionDescription>
            <OptionMeta>{t("destination.portfolio.secondary")}</OptionMeta>
          </OptionText>
          <RadioDot $selected={destination === "portfolio"} aria-hidden />
        </Option>

        <Option
          type="button"
          role="radio"
          aria-checked={destination === "watchlist"}
          $selected={destination === "watchlist"}
          onClick={() => onChange("watchlist")}
        >
          <IconWrap $selected={destination === "watchlist"}>
            <Star size={18} strokeWidth={1.8} aria-hidden />
          </IconWrap>
          <OptionText>
            <OptionTitle>{t("destination.watchlist.title")}</OptionTitle>
            <OptionDescription>
              {t("destination.watchlist.description")}
            </OptionDescription>
            <OptionMeta>{t("destination.watchlist.secondary")}</OptionMeta>
          </OptionText>
          <RadioDot $selected={destination === "watchlist"} aria-hidden />
        </Option>
      </Options>
    </Panel>
  );
};

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  text-align: start;
`;

const Helper = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;

const selectedOption = css`
  border-color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Option = styled.button<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-block-size: 5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: start;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;

  ${({ $selected }) => ($selected ? selectedOption : "")}

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.background.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const IconWrap = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.brand.primary : theme.colors.background.soft};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.text.inverse : theme.colors.brand.primary};
`;

const OptionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const OptionTitle = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const OptionDescription = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const OptionMeta = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const RadioDot = styled.span<{ $selected: boolean }>`
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 50%;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.strong};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.brand.primary : theme.colors.background.card};
  box-shadow: ${({ $selected, theme }) =>
    $selected ? `inset 0 0 0 3px ${theme.colors.background.card}` : "none"};
`;
