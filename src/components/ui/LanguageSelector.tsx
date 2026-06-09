"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { getLanguageOptions } from "@/data/i18n/mappers";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import { usePathname, useRouter } from "@/i18n/routing";
import { theme } from "@/lib/theme/theme";
import { mapLocaleToDisplayCode } from "@/utils/i18n/mappers";

const languageOptions = getLanguageOptions();
const mobileQuery = `(max-width: ${theme.breakpoints.tablet - 1}px)`;

export const LanguageSelector = () => {
  const t = useTranslations("language");
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileQuery);

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  const switchLocale = useCallback(
    (nextLocale: SupportedLocale) => {
      if (nextLocale !== locale) {
        router.replace(pathname, { locale: nextLocale });
      }
      closeMenu();
    },
    [closeMenu, locale, pathname, router],
  );

  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const getLabel = (optionLocale: SupportedLocale) => {
    if (optionLocale === "he") return t("hebrew");
    return t("english");
  };

  const renderOption = (optionLocale: SupportedLocale, compact?: boolean) => {
    const isSelected = locale === optionLocale;

    return (
      <OptionButton
        key={optionLocale}
        type="button"
        $selected={isSelected}
        $compact={compact ?? false}
        onClick={() => switchLocale(optionLocale)}
        aria-current={isSelected ? "true" : undefined}
      >
        <OptionLabel>{getLabel(optionLocale)}</OptionLabel>
        {isSelected ? (
          <CheckIcon size={18} strokeWidth={2} aria-hidden />
        ) : null}
      </OptionButton>
    );
  };

  const dropdownTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const };

  return (
    <Container ref={containerRef}>
      <TriggerButton
        type="button"
        onClick={toggleMenu}
        aria-label={t("changeLanguage")}
        aria-expanded={isOpen}
        aria-haspopup={isMobile ? "dialog" : "listbox"}
      >
        <Languages size={16} strokeWidth={1.75} aria-hidden />
        <TriggerCode>{mapLocaleToDisplayCode(locale)}</TriggerCode>
      </TriggerButton>

      {!isMobile ? (
        <AnimatePresence>
          {isOpen ? (
            <Dropdown
              role="listbox"
              aria-label={t("selectLanguage")}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: -6, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }
              }
              transition={dropdownTransition}
            >
              {languageOptions.map((option) => renderOption(option.locale))}
            </Dropdown>
          ) : null}
        </AnimatePresence>
      ) : null}

      {isMobile ? (
        <BottomSheet
          isOpen={isOpen}
          onClose={closeMenu}
          title={t("selectLanguage")}
          closeLabel={t("close")}
        >
          <SheetOptions>
            {languageOptions.map((option) => renderOption(option.locale, true))}
          </SheetOptions>
        </BottomSheet>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.border.strong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const TriggerCode = styled.span`
  min-width: 1.25rem;
  text-align: center;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  inset-inline-end: 0;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  min-width: 10rem;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const OptionButton = styled.button<{ $selected: boolean; $compact: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  min-height: ${({ $compact }) => ($compact ? "2.75rem" : "2.25rem")};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.brand.primarySoft : "transparent"};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme, $selected }) =>
    $selected ? theme.typography.weight.semibold : theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-align: start;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.colors.brand.primarySoft : theme.colors.background.soft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 1px;
  }
`;

const OptionLabel = styled.span`
  flex: 1;
`;

const CheckIcon = styled(Check)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const SheetOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
