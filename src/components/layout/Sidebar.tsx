"use client";

import { Gem } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { SidebarResizeHandle } from "./SidebarResizeHandle";
import { AppBrand } from "@/components/ui/AppBrand";
import { MarketSessionReminder } from "@/components/ui/MarketSessionReminder";
import {
  getSidebarLayoutBounds,
  useSidebarLayoutStore,
} from "@/store/sidebar-layout.store";
import { usePaywallStore } from "@/store/paywall.store";
import styled, { css } from "styled-components";

const { minPx, maxPx } = getSidebarLayoutBounds();

type SidebarProps = {
  $compact?: boolean;
  $mobileOpen?: boolean;
  $resizable?: boolean;
  onNavigate?: () => void;
};

export const Sidebar = ({
  $compact = false,
  $mobileOpen = false,
  $resizable = false,
  onNavigate,
}: SidebarProps) => {
  const tApp = useTranslations("app");
  const tShell = useTranslations("shell");
  const [isResizing, setIsResizing] = useState(false);
  const widthPx = useSidebarLayoutStore((state) => state.widthPx);
  const setWidthPx = useSidebarLayoutStore((state) => state.setWidthPx);
  const resetWidthPx = useSidebarLayoutStore((state) => state.resetWidthPx);
  const openPaywall = usePaywallStore((state) => state.open);
  const useCustomWidth = $resizable && !$compact;

  return (
    <Aside
      $compact={$compact}
      $mobileOpen={$mobileOpen}
      $widthPx={useCustomWidth ? widthPx : undefined}
      $isResizing={isResizing}
    >
      <BrandBlock $compact={$compact}>
        <AppBrand $compact={$compact} />
        {!$compact ? <Tagline>{tApp("tagline")}</Tagline> : null}
      </BrandBlock>

      <Suspense fallback={<NavFallback $compact={$compact} />}>
        <SidebarNav $compact={$compact} onNavigate={onNavigate} />
      </Suspense>

      <BottomCards $compact={$compact}>
        {!$compact ? (
          <>
            <UpgradeCard>
              <UpgradeIconWrap>
                <Gem size={20} strokeWidth={1.9} aria-hidden />
              </UpgradeIconWrap>
              <UpgradeTitle>{tShell("upgradeCard.title")}</UpgradeTitle>
              <UpgradeCopy>{tShell("upgradeCard.description")}</UpgradeCopy>
              <UpgradeButton type="button" onClick={openPaywall}>
                {tShell("upgradeCard.cta")}
              </UpgradeButton>
            </UpgradeCard>

            <MarketSessionReminder />
          </>
        ) : (
          <CompactMarketBadge title={tShell("marketCard.statusOpen")}>
            <CompactStatusDot aria-hidden />
          </CompactMarketBadge>
        )}
      </BottomCards>

      {useCustomWidth ? (
        <SidebarResizeHandle
          enabled
          widthPx={widthPx}
          minPx={minPx}
          maxPx={maxPx}
          onWidthChange={setWidthPx}
          onResetWidth={resetWidthPx}
          onResizingChange={setIsResizing}
        />
      ) : null}
    </Aside>
  );
};

const Aside = styled.aside<{
  $compact: boolean;
  $mobileOpen: boolean;
  $widthPx?: number;
  $isResizing: boolean;
}>`
  position: fixed;
  inset-block: 0;
  inset-inline-start: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.card};
  border-inline-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  width: ${({ theme, $compact, $widthPx }) => {
    if ($compact) {
      return theme.layout.sidebarWidthNarrow;
    }
    if ($widthPx != null) {
      return `${$widthPx}px`;
    }
    return theme.layout.sidebarWidth;
  }};
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.sidebar};
  transition: ${({ $isResizing }) =>
    $isResizing
      ? "none"
      : `width 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1)`};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    ${({ $compact, theme }) =>
      !$compact &&
      css`
        width: ${theme.layout.sidebarWidthNarrow};
        padding-inline: ${theme.spacing.sm};
      `}
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    width: ${({ theme }) => theme.layout.sidebarWidth};
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
    transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? "0" : "-100%")});
    box-shadow: ${({ theme, $mobileOpen }) =>
      $mobileOpen ? theme.colors.shadow.card : theme.colors.shadow.soft};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    html[dir="rtl"] & {
      transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? "0" : "100%")});
    }
  }
`;

const BrandBlock = styled.div<{ $compact: boolean }>`
  margin-block-end: ${({ theme }) => theme.spacing.xl};
  text-align: ${({ $compact }) => ($compact ? "center" : "start")};
  transition: text-align 0.28s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Tagline = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  transition:
    opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
`;

const BottomCards = styled.footer<{ $compact: boolean }>`
  margin-block-start: auto;
  padding-block-start: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  ${({ $compact }) =>
    $compact &&
    css`
      align-items: center;
    `}
`;

const SidebarCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.elevated};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const UpgradeCard = styled(SidebarCard)`
  padding: ${({ theme }) => theme.spacing.md};
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, ${({ theme }) => theme.colors.chart.purple} 8%, transparent),
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 5%, transparent)
    ),
    ${({ theme }) => theme.colors.background.elevated};
`;

const UpgradeIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.chart.purple};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const UpgradeTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const UpgradeCopy = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: 1.65;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const UpgradeButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.inverse};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chart.purple},
    ${({ theme }) => theme.colors.brand.primary}
  );
  box-shadow: 0 10px 20px
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 18%, transparent);
  cursor: pointer;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 24%, transparent);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const CompactMarketBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.elevated};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const CompactStatusDot = styled.span`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.status.positive};
  box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.status.positiveSoft};
`;

const NavFallback = styled.div<{ $compact: boolean }>`
  flex: 1;
  min-height: 12rem;
`;
