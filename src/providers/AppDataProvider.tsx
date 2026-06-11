"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/supabase";
import { useAuth } from "@/providers/useAuth";
import { useAppDataStore } from "@/store/app-data.store";
import { waitForAppDataRehydration } from "@/utils/app-data/appDataPersistence";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import {
  logAppDataAuthMode,
  logAppDataLoadedPortfolioHoldings,
  logAppDataSnapshot,
  logAppDataStartupSymbols,
  logAppDataUsingDemoPortfolio,
} from "@/utils/app-data/devAppDataLog";
import {
  clearUserDataSyncContext,
  hydrateUserDataFromSupabase,
  resetUserSettingsToDefaults,
  setCachedUserId,
} from "@/utils/user-data/userDataSync";

type AppDataProviderProps = {
  children: ReactNode;
};

/**
 * Mount point for global app data.
 * On mount: rehydrates user-owned data from localStorage, optionally Supabase when
 * authenticated, then pre-fetches quote/profile for portfolio symbols.
 * State and actions: `useAppData()` → `useAppDataStore` (Zustand).
 * See `src/data/data-architecture.md` for screen → data mapping.
 */
export const AppDataProvider = ({ children }: AppDataProviderProps) => {
  const { user, isAuthLoading, isAuthenticated } = useAuth();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const sync = async () => {
      await waitForAppDataRehydration(useAppDataStore);

      const previousUserId = prevUserIdRef.current;
      const currentUserId = isAuthenticated && user?.id ? user.id : null;

      if (isSupabaseConfigured && currentUserId) {
        useAppDataStore.getState().setAppDataMode({
          authMode: "authenticated",
          isUserDataLoaded: false,
        });
        logAppDataAuthMode("authenticated");

        useAppDataStore.getState().resetToEmptyUserData();

        setCachedUserId(currentUserId);
        await hydrateUserDataFromSupabase(currentUserId);

        const stateAfterHydrate = useAppDataStore.getState();
        useAppDataStore.getState().setAppDataMode({
          isUserDataLoaded: true,
          portfolioDataSource: "supabase",
          isUsingDemoPortfolio: false,
          isAppDataInitialized: true,
        });

        logAppDataLoadedPortfolioHoldings(stateAfterHydrate.portfolioHoldings.length);
        logAppDataUsingDemoPortfolio(false);
      } else {
        clearUserDataSyncContext();

        if (previousUserId !== undefined && previousUserId !== null && currentUserId === null) {
          resetUserSettingsToDefaults();
        }

        useAppDataStore.getState().resetToEmptyUserData();
        useAppDataStore.getState().setAppDataMode({
          authMode: "local",
          portfolioDataSource: "localMock",
          isUserDataLoaded: true,
          isUsingDemoPortfolio: false,
          isAppDataInitialized: true,
        });

        logAppDataAuthMode("local");
        logAppDataUsingDemoPortfolio(false);
      }

      prevUserIdRef.current = currentUserId;

      const state = useAppDataStore.getState();
      const notesCount = Object.values(state.stockGeneralNotesBySymbol).reduce(
        (sum, notes) => sum + notes.length,
        0,
      );

      logAppDataSnapshot({
        authMode: state.authMode,
        isUserDataLoaded: state.isUserDataLoaded,
        isAppDataReady: true,
        portfolioHoldingsCount: state.portfolioHoldings.length,
        watchlistItemsCount: state.watchlistItems.length,
        alertsCount: state.userCreatedAlerts.length,
        notesCount,
        isUsingDemoPortfolio: state.isUsingDemoPortfolio,
      });

      const symbols = collectUniqueSymbols(
        state.portfolioHoldings.map((holding) => holding.symbol),
      );

      if (symbols.length === 0) {
        return;
      }

      logAppDataStartupSymbols(symbols);
      void state.ensureStockDataForSymbols(symbols, {
        sections: ["quote", "profile"],
      });
    };

    void sync();
  }, [user?.id, isAuthLoading, isAuthenticated]);

  if (process.env.NODE_ENV === "development") {
    console.info("[app-data] AppDataProvider mounted");
  }

  return children;
};
