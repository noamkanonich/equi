import type { AuthChangeEvent, Subscription } from "@supabase/supabase-js";
import type {
  AuthActionResult,
  AuthSessionResult,
  AuthSignOutResult,
  AuthUserResult,
  BootstrapAuthResult,
  SignInInput,
  SignUpInput,
} from "@/data/auth/auth.types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/supabase";
import {
  mapSupabaseAuthError,
  mapSupabaseSessionToAuthSession,
  mapSupabaseUserToAuthUser,
} from "@/services/auth/mappers";

const getAuthClient = () => {
  if (!isSupabaseConfigured) {
    return null;
  }

  return getSupabaseBrowserClient();
};

export const signUpWithEmail = async (input: SignUpInput): Promise<AuthActionResult> => {
  const client = getAuthClient();
  if (!client) {
    return { user: null, session: null, error: null };
  }

  const { data, error } = await client.auth.signUp({
    email: input.email.trim(),
    password: input.password,
  });

  const mappedError = mapSupabaseAuthError(error);
  const user = mapSupabaseUserToAuthUser(data.user);
  const session = mapSupabaseSessionToAuthSession(data.session);

  return {
    user,
    session,
    error: mappedError,
    needsEmailConfirmation: Boolean(user && !session && !mappedError),
  };
};

export const signInWithEmail = async (input: SignInInput): Promise<AuthActionResult> => {
  const client = getAuthClient();
  if (!client) {
    return { user: null, session: null, error: null };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  return {
    user: mapSupabaseUserToAuthUser(data.user),
    session: mapSupabaseSessionToAuthSession(data.session),
    error: mapSupabaseAuthError(error),
  };
};

export const signOut = async (): Promise<AuthSignOutResult> => {
  const client = getAuthClient();
  if (!client) {
    return { error: null };
  }

  const { error } = await client.auth.signOut();
  return { error: mapSupabaseAuthError(error) };
};

export const getCurrentUser = async (): Promise<AuthUserResult> => {
  const client = getAuthClient();
  if (!client) {
    return { user: null, error: null };
  }

  const { data, error } = await client.auth.getUser();
  return {
    user: mapSupabaseUserToAuthUser(data.user),
    error: mapSupabaseAuthError(error),
  };
};

export const getCurrentSession = async (): Promise<AuthSessionResult> => {
  const client = getAuthClient();
  if (!client) {
    return { session: null, error: null };
  }

  const { data, error } = await client.auth.getSession();
  return {
    session: mapSupabaseSessionToAuthSession(data.session),
    error: mapSupabaseAuthError(error),
  };
};

export const getBootstrapAuthState = async (): Promise<BootstrapAuthResult> => {
  const client = getAuthClient();
  if (!client) {
    return { user: null, session: null, error: null };
  }

  const { data, error } = await client.auth.getSession();
  const mappedError = mapSupabaseAuthError(error);

  if (mappedError) {
    return { user: null, session: null, error: mappedError };
  }

  const session = mapSupabaseSessionToAuthSession(data.session);
  const user = mapSupabaseUserToAuthUser(data.session?.user ?? null);

  return { user, session, error: null };
};

export const onAuthStateChange = (
  callback: (
    event: AuthChangeEvent,
    session: ReturnType<typeof mapSupabaseSessionToAuthSession>,
    user: ReturnType<typeof mapSupabaseUserToAuthUser>,
  ) => void,
): Subscription | null => {
  const client = getAuthClient();
  if (!client) {
    return null;
  }

  const { data } = client.auth.onAuthStateChange((event, session) => {
    callback(
      event,
      mapSupabaseSessionToAuthSession(session),
      mapSupabaseUserToAuthUser(session?.user ?? null),
    );
  });

  return data.subscription;
};
