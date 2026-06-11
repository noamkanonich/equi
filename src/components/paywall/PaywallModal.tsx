"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gem, Shield, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { PAYWALL_PLAN_CONFIGS, type BillingPeriod } from "@/data/paywall/paywall.types";
import { usePaywallStore } from "@/store/paywall.store";
import { useIsClient } from "@/utils/client/useIsClient";
import { PaywallBillingToggle } from "./PaywallBillingToggle";
import { PaywallFeatureStrip } from "./PaywallFeatureStrip";
import { PaywallPlanCard } from "./PaywallPlanCard";

const TRUST_ICONS = [Shield, Zap, Sparkles];

export const PaywallModal = () => {
  const isClient = useIsClient();
  const isOpen = usePaywallStore((state) => state.isOpen);
  const close = usePaywallStore((state) => state.close);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("paywall");
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  // Lock body scroll when open
  useEffect(() => {
    if (!isClient) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isClient]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isClient) return null;

  const trustKeys = ["secure", "cancel", "support"] as const;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <Layer key="paywall-modal" role="dialog" aria-modal="true" aria-label={t("ariaLabel")}>
          <Backdrop
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={close}
            aria-hidden
          />

          <PanelMotion
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <CloseButton type="button" onClick={close} aria-label={t("close")}>
              <X size={18} strokeWidth={1.8} aria-hidden />
            </CloseButton>

            <HeaderSection>
              <GemGlow aria-hidden>
                <Gem size={28} strokeWidth={1.6} />
              </GemGlow>
              <PremiumBadge>{t("premiumBadge")}</PremiumBadge>
              <ModalTitle>{t("title")}</ModalTitle>
              <ModalSubtitle>{t("subtitle")}</ModalSubtitle>
            </HeaderSection>

            <ToggleSection>
              <PaywallBillingToggle value={billing} onChange={setBilling} />
            </ToggleSection>

            <PlansGrid>
              {PAYWALL_PLAN_CONFIGS.map((plan) => (
                <PaywallPlanCard key={plan.id} plan={plan} billing={billing} />
              ))}
            </PlansGrid>

            <FeatureStripSection>
              <PaywallFeatureStrip />
            </FeatureStripSection>

            <TrustFooter>
              {trustKeys.map((key, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <TrustItem key={key}>
                    <TrustIcon aria-hidden>
                      <Icon size={14} strokeWidth={1.8} />
                    </TrustIcon>
                    {t(`trust.${key}`)}
                  </TrustItem>
                );
              })}
            </TrustFooter>
          </PanelMotion>
        </Layer>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay.scrim};
  backdrop-filter: blur(4px);
`;

const PanelMotion = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: min(56rem, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  inset-block-start: ${({ theme }) => theme.spacing.md};
  inset-inline-end: ${({ theme }) => theme.spacing.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  z-index: 2;
  transition:
    background 0.18s,
    color 0.18s;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  padding-block-start: ${({ theme }) => theme.spacing.sm};
`;

const GemGlow = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    color-mix(in srgb, ${({ theme }) => theme.colors.chart.purple} 30%, transparent),
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 15%, transparent)
  );
  box-shadow:
    0 0 0 8px color-mix(in srgb, ${({ theme }) => theme.colors.chart.purple} 10%, transparent),
    0 0 32px color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 20%, transparent);
  color: ${({ theme }) => theme.colors.chart.purple};
  margin-block-end: ${({ theme }) => theme.spacing.xs};
`;

const PremiumBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chart.purple},
    ${({ theme }) => theme.colors.brand.primary}
  );
  color: #fff;
  font-size: 0.7rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  }
`;

const ModalSubtitle = styled.p`
  margin: 0;
  max-width: 30rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: 1.6;
`;

const ToggleSection = styled.div`
  display: flex;
  justify-content: center;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding-block-start: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    max-width: 22rem;
    margin-inline: auto;
    width: 100%;
  }
`;

const FeatureStripSection = styled.div`
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const TrustFooter = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 1.5rem;
`;

const TrustItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const TrustIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.brand.primary};
`;
