"use client";

import { useId } from "react";
import { GitCompare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { recommendedScoringWeights, scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type { ScoringFactorWeights } from "@/data/scoring/scoring.types";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type ScoringComparisonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentWeights: ScoringFactorWeights;
};

export const ScoringComparisonModal = ({
  isOpen,
  onClose,
  currentWeights,
}: ScoringComparisonModalProps) => {
  const t = useTranslations("settings.scoringModel.modals.compare");
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
              <GitCompare size={20} strokeWidth={1.9} />
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
        <Table>
          <TableHead>
            <HeadFactor>{t("factor")}</HeadFactor>
            <HeadValue>{t("current")}</HeadValue>
            <HeadValue>{t("recommended")}</HeadValue>
            <HeadDiff>{t("difference")}</HeadDiff>
          </TableHead>
          {scoringFactorKeys.map((factorKey) => {
            const current = currentWeights[factorKey];
            const recommended = recommendedScoringWeights[factorKey];
            const diff = current - recommended;

            return (
              <TableRow key={factorKey}>
                <FactorName>{tFactors(`${factorKey}.title`)}</FactorName>
                <ValueCell>{current}%</ValueCell>
                <ValueCell $muted>{recommended}%</ValueCell>
                <DiffCell $positive={diff > 0} $negative={diff < 0}>
                  {diff > 0 ? `+${diff}` : diff}%
                </DiffCell>
              </TableRow>
            );
          })}
        </Table>
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
  inline-size: min(32rem, 100%);
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
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  min-block-size: 0;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(3.5rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block-end: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const headCell = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const HeadFactor = styled(headCell)``;
const HeadValue = styled(headCell)``;
const HeadDiff = styled(headCell)`
  text-align: end;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(3.5rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: none;
  }
`;

const FactorName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const ValueCell = styled.span<{ $muted?: boolean }>`
  color: ${({ theme, $muted }) =>
    $muted ? theme.colors.text.secondary : theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  font-variant-numeric: tabular-nums;
`;

const DiffCell = styled.span<{ $positive?: boolean; $negative?: boolean }>`
  text-align: end;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $positive, $negative }) => {
    if ($positive) return theme.colors.status.positive;
    if ($negative) return theme.colors.status.negative;
    return theme.colors.text.muted;
  }};
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
`;
