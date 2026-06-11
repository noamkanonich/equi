"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { BillingPeriod } from "@/data/paywall/paywall.types";

type PaywallBillingToggleProps = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
};

type PillRect = { left: number; width: number };

export const PaywallBillingToggle = ({ value, onChange }: PaywallBillingToggleProps) => {
  const t = useTranslations("paywall.billing");
  const trackRef = useRef<HTMLDivElement>(null);
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const yearlyRef = useRef<HTMLButtonElement>(null);
  const [pillRect, setPillRect] = useState<PillRect>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const track = trackRef.current;
    const btn = value === "yearly" ? yearlyRef.current : monthlyRef.current;
    if (!track || !btn) return;

    const trackRect = track.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setPillRect({
      left: btnRect.left - trackRect.left,
      width: btnRect.width,
    });
  }, [value]);

  return (
    <Wrap>
      <Track ref={trackRef}>
        <Option
          ref={monthlyRef}
          type="button"
          $active={value === "monthly"}
          onClick={() => onChange("monthly")}
        >
          {t("monthly")}
        </Option>
        <Option
          ref={yearlyRef}
          type="button"
          $active={value === "yearly"}
          onClick={() => onChange("yearly")}
        >
          {t("yearly")}
          <SaveBadge>{t("yearlySavings")}</SaveBadge>
        </Option>
        <Pill
          aria-hidden
          style={{ left: pillRect.left, width: pillRect.width }}
          $visible={pillRect.width > 0}
        />
      </Track>
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  justify-content: center;
`;

const Track = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.soft};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 999px;
  padding: 3px;
`;

const Pill = styled.span<{ $visible: boolean }>`
  position: absolute;
  inset-block: 3px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition:
    left 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.26s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

const Option = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1.1rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text.primary : theme.colors.text.muted};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme, $active }) =>
    $active
      ? theme.typography.weight.semibold
      : theme.typography.weight.regular};
  cursor: pointer;
  transition:
    color 0.2s,
    font-weight 0.2s;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const SaveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.status.positiveSoft};
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.01em;
`;
