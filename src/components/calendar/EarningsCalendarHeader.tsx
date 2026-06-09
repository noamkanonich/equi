"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styled from "styled-components";

type EarningsCalendarHeaderProps = {
  titleId: string;
  descriptionId: string;
  title: string;
  subtitle: string;
  monthLabel: string;
  previousLabel: string;
  nextLabel: string;
  closeLabel: string;
  showCloseButton?: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onClose: () => void;
};

export const EarningsCalendarHeader = ({
  titleId,
  descriptionId,
  title,
  subtitle,
  monthLabel,
  previousLabel,
  nextLabel,
  closeLabel,
  showCloseButton = true,
  onPreviousMonth,
  onNextMonth,
  onClose,
}: EarningsCalendarHeaderProps) => {
  return (
    <Header>
      <TitleGroup>
        <Title id={titleId}>{title}</Title>
        <Subtitle id={descriptionId}>{subtitle}</Subtitle>
      </TitleGroup>
      <Controls>
        <MonthStepper aria-label={monthLabel}>
          <IconButton type="button" onClick={onPreviousMonth} aria-label={previousLabel}>
            <PreviousIcon size={18} strokeWidth={1.8} aria-hidden />
          </IconButton>
          <MonthLabel>{monthLabel}</MonthLabel>
          <IconButton type="button" onClick={onNextMonth} aria-label={nextLabel}>
            <NextIcon size={18} strokeWidth={1.8} aria-hidden />
          </IconButton>
        </MonthStepper>
        {showCloseButton ? (
          <CloseButton type="button" onClick={onClose} aria-label={closeLabel}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        ) : null}
      </Controls>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    padding: 0;
    border-block-end: 0;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TitleGroup = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
  text-align: start;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const Controls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
  }
`;

const MonthStepper = styled.div`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.app};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex: 1;
    justify-content: space-between;
  }
`;

const MonthLabel = styled.span`
  min-inline-size: 8.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: center;
`;

const IconButton = styled.button`
  inline-size: 2.25rem;
  block-size: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const PreviousIcon = styled(ChevronLeft)`
  html[dir="rtl"] & {
    transform: rotate(180deg);
  }
`;

const NextIcon = styled(ChevronRight)`
  html[dir="rtl"] & {
    transform: rotate(180deg);
  }
`;

const CloseButton = styled(IconButton)`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
`;
