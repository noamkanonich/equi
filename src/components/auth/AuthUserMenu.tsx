"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogOut, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useRouter } from "@/i18n/routing";
import { isSupabaseConfigured } from "@/lib/supabase/supabase";
import { useAuth } from "@/providers/useAuth";
import { getEmailInitials } from "@/utils/auth/getEmailInitials";

export const AuthUserMenu = () => {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");
  const theme = useTheme();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { user, isAuthenticated, signOut } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.tablet - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, [theme.breakpoints.tablet]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!isOpen || isMobile) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeMenu, isMobile, isOpen]);

  const handleNavigate = (href: "/profile" | "/settings") => {
    closeMenu();
    router.push(href);
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  const dropdownTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const };

  if (!isAuthenticated || !user) {
    return null;
  }

  const initials = getEmailInitials(user.email);

  const menuContent = (
    <>
      <UserInfo>
        <UserEmail>{t("signedInAs", { email: user.email })}</UserEmail>
        {isSupabaseConfigured ? (
          <ModeBadge $variant="synced">{t("syncedMode")}</ModeBadge>
        ) : null}
      </UserInfo>
      <MenuButton type="button" onClick={() => handleNavigate("/profile")}>
        <User size={16} strokeWidth={1.75} aria-hidden />
        {t("profile")}
      </MenuButton>
      <MenuButton type="button" onClick={() => handleNavigate("/settings")}>
        <Settings size={16} strokeWidth={1.75} aria-hidden />
        {tNav("settings")}
      </MenuButton>
      <MenuDivider />
      <MenuButton type="button" onClick={handleSignOut}>
        <LogOut size={16} strokeWidth={1.75} aria-hidden />
        {t("signOut")}
      </MenuButton>
    </>
  );

  return (
    <Container ref={containerRef}>
      <UserAvatar
        type="button"
        aria-label={t("openProfile")}
        aria-expanded={isOpen}
        aria-haspopup={isMobile ? "dialog" : "menu"}
        onClick={toggleMenu}
      >
        {initials}
      </UserAvatar>

      {!isMobile ? (
        <AnimatePresence>
          {isOpen ? (
            <Dropdown
              role="menu"
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: -6, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }
              }
              transition={dropdownTransition}
            >
              {menuContent}
            </Dropdown>
          ) : null}
        </AnimatePresence>
      ) : null}

      {isMobile ? (
        <BottomSheet
          isOpen={isOpen}
          onClose={closeMenu}
          title={t("signedInAs", { email: user.email })}
          closeLabel={t("close")}
        >
          <SheetContent>{menuContent}</SheetContent>
        </BottomSheet>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ModeBadge = styled.span<{ $variant: "synced" }>`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const UserAvatar = styled.button`
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  inset-inline-end: 0;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  min-width: 14rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  margin-block-end: ${({ theme }) => theme.spacing.xs};
`;

const UserEmail = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  word-break: break-all;
`;

const MenuDivider = styled.div`
  block-size: 1px;
  background: ${({ theme }) => theme.colors.border.subtle};
  margin-block: ${({ theme }) => theme.spacing.xs};
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  cursor: pointer;
  text-align: start;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 1px;
  }
`;

const SheetContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
