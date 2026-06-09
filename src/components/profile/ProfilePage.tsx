"use client";

import { motion, useReducedMotion } from "framer-motion";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { AuthModal } from "@/components/auth/AuthModal";
import { PageContent } from "@/components/layout/PageContent";
import { Button } from "@/components/ui/Button";
import { ProfileAccountCard } from "@/components/profile/ProfileAccountCard";
import { ProfileDataStatusCard } from "@/components/profile/ProfileDataStatusCard";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileQuickActionsCard } from "@/components/profile/ProfileQuickActionsCard";
import { useAuth } from "@/providers/useAuth";
import { useAppDataStore } from "@/store/app-data.store";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { countSyncedNotes } from "@/utils/profile/countSyncedNotes";

export const ProfilePage = () => {
  const t = useTranslations("profile");
  const prefersReducedMotion = useReducedMotion();
  const { user, isAuthenticated, isAuthLoading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const portfolioHoldings = useAppDataStore((state) => state.portfolioHoldings);
  const watchlistItems = useAppDataStore((state) => state.watchlistItems);
  const userCreatedAlerts = useAppDataStore((state) => state.userCreatedAlerts);
  const stockThesisBySymbol = useAppDataStore((state) => state.stockThesisBySymbol);
  const stockGeneralNotesBySymbol = useAppDataStore(
    (state) => state.stockGeneralNotesBySymbol,
  );

  const notesCount = useMemo(
    () => countSyncedNotes(stockThesisBySymbol, stockGeneralNotesBySymbol),
    [stockGeneralNotesBySymbol, stockThesisBySymbol],
  );

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  if (isAuthLoading) {
    return (
      <PageContent>
        <PageHeader>
          <IconWrap aria-hidden>
            <User size={20} strokeWidth={1.9} />
          </IconWrap>
          <Copy>
            <Title>{t("title")}</Title>
            <Subtitle>{t("loading")}</Subtitle>
          </Copy>
        </PageHeader>
      </PageContent>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <PageContent>
          <PageHeader>
            <IconWrap aria-hidden>
              <User size={20} strokeWidth={1.9} />
            </IconWrap>
            <Copy>
              <Title>{t("title")}</Title>
              <Subtitle>{t("subtitle")}</Subtitle>
            </Copy>
          </PageHeader>
          <LocalCard>
            <LocalTitle>{t("localMode")}</LocalTitle>
            <LocalDescription>{t("localModeDescription")}</LocalDescription>
            <Button type="button" onClick={() => setIsAuthOpen(true)}>
              {t("signInPrompt")}
            </Button>
          </LocalCard>
        </PageContent>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <PageContent>
      <PageHeader>
        <IconWrap aria-hidden>
          <User size={20} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{t("title")}</Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Copy>
      </PageHeader>

      <Grid>
        <MotionBlock {...reveal(0)}>
          <ProfileHeaderCard user={user} isAuthenticated={isAuthenticated} />
        </MotionBlock>
        <MotionBlock {...reveal(1)}>
          <ProfileAccountCard user={user} isAuthenticated={isAuthenticated} />
        </MotionBlock>
        <MotionBlock {...reveal(2)}>
          <ProfileDataStatusCard
            holdingsCount={portfolioHoldings.length}
            watchlistCount={watchlistItems.length}
            notesCount={notesCount}
            alertsCount={userCreatedAlerts.length}
          />
        </MotionBlock>
        <MotionBlock {...reveal(3)}>
          <ProfileQuickActionsCard />
        </MotionBlock>
      </Grid>
    </PageContent>
  );
};

const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
  flex-shrink: 0;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.layout.pageGap};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MotionBlock = styled(motion.div)`
  min-inline-size: 0;
`;

const LocalCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-inline-size: 28rem;
`;

const LocalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LocalDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;
