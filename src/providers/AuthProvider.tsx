"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthErrorState, AuthSession, AuthUser } from "@/data/auth/auth.types";
import { isSupabaseConfigured } from "@/lib/supabase/supabase";
import {
  getBootstrapAuthState,
  getCurrentUser,
  onAuthStateChange,
  signInWithEmail,
  signOut as signOutService,
  signUpWithEmail,
} from "@/services/auth/auth.service";
import {
  clearUserDataSyncContext,
  setCachedUserId,
} from "@/utils/user-data/userDataSync";

type AuthContextValue = {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthLoading: boolean;
  authError: AuthErrorState;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const applyAuthenticatedState = (
  nextUser: AuthUser | null,
  nextSession: AuthSession | null,
  setUser: (user: AuthUser | null) => void,
  setSession: (session: AuthSession | null) => void,
) => {
  setUser(nextUser);
  setSession(nextSession);

  if (nextUser?.id && nextSession?.accessToken) {
    setCachedUserId(nextUser.id);
  }
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState<AuthErrorState>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    const bootstrap = async () => {
      const result = await getBootstrapAuthState();

      if (!isMounted) {
        return;
      }

      if (result.session?.accessToken && result.user?.id) {
        applyAuthenticatedState(result.user, result.session, setUser, setSession);
        setAuthError(null);

        void getCurrentUser().then((userResult) => {
          if (!isMounted || userResult.error || !userResult.user) {
            return;
          }

          setUser(userResult.user);
        });
      } else if (result.error) {
        setAuthError(result.error);
        setUser(null);
        setSession(null);
        clearUserDataSyncContext();
      } else {
        setUser(null);
        setSession(null);
        clearUserDataSyncContext();
      }

      setIsAuthLoading(false);
    };

    void bootstrap();

    const subscription = onAuthStateChange((event, nextSession, nextUser) => {
      if (!isMounted) {
        return;
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        clearUserDataSyncContext();
        setAuthError(null);
        setIsAuthLoading(false);
        return;
      }

      if (nextSession?.accessToken && nextUser?.id) {
        applyAuthenticatedState(nextUser, nextSession, setUser, setSession);
        setAuthError(null);
      }

      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null);

    const result = await signInWithEmail({ email, password });

    if (result.error) {
      setAuthError(result.error);
      return false;
    }

    if (result.user && result.session) {
      applyAuthenticatedState(result.user, result.session, setUser, setSession);
    }

    return Boolean(result.user?.id && result.session?.accessToken);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setAuthError(null);

    const result = await signUpWithEmail({ email, password });

    if (result.error) {
      setAuthError(result.error);
      return { success: false, needsEmailConfirmation: false };
    }

    if (result.needsEmailConfirmation) {
      return { success: true, needsEmailConfirmation: true };
    }

    if (result.user && result.session) {
      applyAuthenticatedState(result.user, result.session, setUser, setSession);
    }

    return {
      success: Boolean(result.user?.id && result.session?.accessToken),
      needsEmailConfirmation: false,
    };
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    const result = await signOutService();

    if (result.error) {
      setAuthError(result.error);
      return;
    }

    setUser(null);
    setSession(null);
    clearUserDataSyncContext();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthLoading,
      authError,
      isAuthenticated: Boolean(session?.accessToken && user?.id),
      signIn,
      signUp,
      signOut,
      clearAuthError,
    }),
    [authError, clearAuthError, isAuthLoading, session, signIn, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
