"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import type { ComponentProps } from "react";
import { usePathname } from "@/i18n/routing";
import { setLeavingPathname } from "@/utils/motion/pathnameNavigation";
import { overlayFadeTransition, softTransition } from "@/utils/motion/transitions";
import { useSidebarLayoutStore } from "@/store/sidebar-layout.store";
import { CurrencyRatesBootstrap } from "./CurrencyRatesBootstrap";
import { PaywallModal } from "@/components/paywall/PaywallModal";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      setLeavingPathname(pathname);
    };
  }, [pathname]);

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen((open) => !open);
  }, []);

  const sidebarCompact = isTablet && !isMobile;
  const sidebarResizable = !isMobile && !sidebarCompact;
  const sidebarWidthPx = useSidebarLayoutStore((state) => state.widthPx);
  const showMenuButton = isMobile;

  return (
    <Shell>
      <CurrencyRatesBootstrap />
      <PaywallModal />
      <AnimatePresence>
        {isMobile && mobileNavOpen ? (
          <Overlay
            key="mobile-nav-overlay"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={overlayFadeTransition(prefersReducedMotion)}
            onClick={closeMobileNav}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <Sidebar
        $compact={sidebarCompact}
        $mobileOpen={!isMobile || mobileNavOpen}
        $resizable={sidebarResizable}
        onNavigate={closeMobileNav}
      />

      <MainColumn
        $sidebarWidthPx={sidebarResizable ? sidebarWidthPx : undefined}
      >
        <TopBar
          showMenuButton={showMenuButton}
          onMenuClick={toggleMobileNav}
        />
        <MotionContent
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : softTransition(0.34)
          }
        >
          {children}
        </MotionContent>
      </MainColumn>
    </Shell>
  );
};

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  background: ${({ theme }) => theme.colors.background.app};
`;

const MainColumn = styled.div<{ $sidebarWidthPx?: number }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  margin-inline-start: ${({ theme, $sidebarWidthPx }) =>
    $sidebarWidthPx != null
      ? `${$sidebarWidthPx}px`
      : theme.layout.sidebarWidth};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    margin-inline-start: ${({ theme }) => theme.layout.sidebarWidthNarrow};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    margin-inline-start: 0;
  }
`;

const MotionContent = styled(motion.main)<ComponentProps<typeof motion.main>>`
  flex: 1;
  min-inline-size: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay.scrim};
  z-index: ${({ theme }) => theme.zIndex.overlay};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    display: none;
  }
`;
