"use client";

import {
  ArrowLeftRight,
  Bell,
  Briefcase,
  ChartColumnIncreasing,
  Eye,
  FileText,
  LayoutDashboard,
  LineChart,
  Newspaper,
  Settings,
  Sparkles,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import {
  navigationItems,
  type NavIconKey,
  type NavItem,
} from "@/config/navigation.config";
import styled, { css } from "styled-components";
import {
  navItemVariants,
  navStaggerVariants,
  softTransition,
} from "@/utils/motion/transitions";

const iconMap: Record<NavIconKey, LucideIcon> = {
  layoutDashboard: LayoutDashboard,
  briefcase: Briefcase,
  eye: Eye,
  sparkles: Sparkles,
  fileText: FileText,
  newspaper: Newspaper,
  chartColumnIncreasing: ChartColumnIncreasing,
  lineChart: LineChart,
  arrowLeftRight: ArrowLeftRight,
  bell: Bell,
  settings: Settings,
};

type SidebarNavProps = {
  $compact?: boolean;
  onNavigate?: () => void;
};

export const SidebarNav = ({ $compact = false, onNavigate }: SidebarNavProps) => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { activeAlertsCount } = useAppData();

  const isActive = (item: NavItem) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    if (item.href.startsWith("/stocks")) {
      return pathname.startsWith("/stocks");
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <LayoutGroup id="sidebar-nav">
      <NavList
        initial={prefersReducedMotion ? false : "hidden"}
        animate="show"
        variants={navStaggerVariants}
      >
        {navigationItems.map((item) => {
          const Icon = iconMap[item.iconKey];
          const active = isActive(item);
          const label = t(item.labelKey);
          const badgeCount =
            item.href === "/alerts" ? activeAlertsCount : item.badgeCount;

          return (
            <NavItemRow
              key={item.href}
              variants={navItemVariants}
              transition={
                prefersReducedMotion ? { duration: 0 } : softTransition(0.34)
              }
            >
              <NavLink
                href={item.href}
                $active={active}
                $compact={$compact}
                title={$compact ? label : undefined}
                onClick={onNavigate}
              >
                {active ? (
                  <ActiveBackground
                    layoutId="sidebar-active-pill"
                    $compact={$compact}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                            mass: 0.75,
                          }
                    }
                  />
                ) : null}
                <NavIconWrap>
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </NavIconWrap>
                {!$compact ? <NavLabel>{label}</NavLabel> : null}
                {!$compact && badgeCount ? (
                  <NavBadge>{badgeCount}</NavBadge>
                ) : null}
              </NavLink>
            </NavItemRow>
          );
        })}
      </NavList>
    </LayoutGroup>
  );
};

const NavList = styled(motion.ul)`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const NavItemRow = styled(motion.li)``;

const NavLink = styled(Link)<{ $active: boolean; $compact: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  justify-content: ${({ $compact }) => ($compact ? "center" : "flex-start")};
  overflow: hidden;
  isolation: isolate;
  transition:
    color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  ${({ $compact, theme }) =>
    $compact &&
    css`
      padding: ${theme.spacing.sm};
    `}

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.brand.primary : theme.colors.text.primary};
    transform: translateX(${({ $compact }) => ($compact ? "0" : "0.125rem")});
  }

  html[dir="rtl"] &:hover {
    transform: translateX(${({ $compact }) => ($compact ? "0" : "-0.125rem")});
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ActiveBackground = styled(motion.span)<{ $compact: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  z-index: -1;

  ${({ theme }) => css`
    border-inline-start: 3px solid ${theme.colors.brand.primary};
  `}
`;

const NavIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NavLabel = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NavBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 1.35rem;
  block-size: 1.35rem;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  font-variant-numeric: tabular-nums;
`;
