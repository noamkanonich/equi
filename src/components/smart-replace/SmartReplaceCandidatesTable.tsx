"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonTable } from "@/components/ui/states/SkeletonTable";
import type { ReplacementCandidate } from "@/data/smart-replace/smart-replace.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { SmartReplaceCandidateRow } from "./SmartReplaceCandidateRow";

const DEV_SIMULATE_LOADING = false;

type SmartReplaceCandidatesTableProps = {
  candidates: ReplacementCandidate[];
  selectedCandidateId: string;
  locale: string;
  dataState?: DataState;
  onSelectCandidate: (candidateId: string) => void;
};

export const SmartReplaceCandidatesTable = ({
  candidates,
  selectedCandidateId,
  locale,
  dataState,
  onSelectCandidate,
}: SmartReplaceCandidatesTableProps) => {
  const t = useTranslations("smartReplace");
  const tStates = useTranslations("states");
  const [balancedFilterActive, setBalancedFilterActive] = useState(false);

  const visibleCandidates = useMemo(() => {
    if (!balancedFilterActive) return candidates;
    return candidates.filter(
      (candidate) =>
        candidate.matchType === "sameSector" ||
        candidate.matchType === "qualityUpgrade",
    );
  }, [balancedFilterActive, candidates]);

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
  });

  const renderBody = () => {
    if (effectiveState === "loading") {
      return (
        <tbody>
          <tr>
            <StateCell colSpan={8}>
              <SkeletonTable $rows={4} $columns={6} $showHeader={false} />
            </StateCell>
          </tr>
        </tbody>
      );
    }

    if (visibleCandidates.length === 0) {
      return (
        <tbody>
          <tr>
            <StateCell colSpan={8}>
              <NoResultsState
                title={tStates("noResults.title")}
                description={tStates("noResults.description")}
                clearAction={
                  balancedFilterActive
                    ? {
                        label: tStates("noResults.clearFilters"),
                        onClick: () => setBalancedFilterActive(false),
                        variant: "secondary",
                      }
                    : undefined
                }
              />
            </StateCell>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {visibleCandidates.map((candidate) => (
          <SmartReplaceCandidateRow
            key={candidate.id}
            candidate={candidate}
            locale={locale}
            isSelected={candidate.id === selectedCandidateId}
            onSelect={onSelectCandidate}
          />
        ))}
      </tbody>
    );
  };

  return (
    <Card>
      <Header>
        <Title>{t("table.replacementCandidates")}</Title>
        <FilterPill
          type="button"
          $active={balancedFilterActive}
          aria-pressed={balancedFilterActive}
          onClick={() => setBalancedFilterActive((current) => !current)}
        >
          <SlidersHorizontal size={14} strokeWidth={1.9} aria-hidden />
          {t("table.matchByBalanced")}
        </FilterPill>
      </Header>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <HeadCell>{t("table.symbol")}</HeadCell>
              <HeadCell>{t("table.company")}</HeadCell>
              <HeadCell>{t("table.matchType")}</HeadCell>
              <HeadCell $center>{t("table.score")}</HeadCell>
              <HeadCell $numeric>{t("table.upside")}</HeadCell>
              <HeadCell $numeric>{t("table.riskBeta")}</HeadCell>
              <HeadCell>{t("table.keyReason")}</HeadCell>
              <HeadCell $center>{t("table.action")}</HeadCell>
            </tr>
          </thead>
          {renderBody()}
        </Table>
      </TableScroll>
    </Card>
  );
};

const Card = styled.section`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const FilterPill = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primarySoft : theme.colors.background.app};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: 999px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  cursor: pointer;
`;

const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  inline-size: 100%;
  min-inline-size: 62rem;
  border-collapse: collapse;
`;

const HeadCell = styled.th<{ $numeric?: boolean; $center?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: ${({ $numeric, $center }) =>
    $center ? "center" : $numeric ? "end" : "start"};
  white-space: nowrap;
`;

const StateCell = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};
`;
