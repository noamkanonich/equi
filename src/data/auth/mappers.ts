import type { AuthError, Session, User } from "@supabase/supabase-js";
import type { AuthErrorState, AuthSession, AuthUser } from "@/data/auth/auth.types";

export const mapSupabaseUserToAuthUser = (user: User | null): AuthUser | null => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? undefined,
  };
};

export const mapSupabaseSessionToAuthSession = (
  session: Session | null,
): AuthSession | null => {
  if (!session) {
    return null;
  }

  return {
    accessToken: session.access_token,
    expiresAt: session.expires_at,
  };
};

const AUTH_ERROR_CODE_MAP: Record<string, string> = {
  invalid_credentials: "invalid_credentials",
  invalid_grant: "invalid_credentials",
  user_already_registered: "user_already_registered",
  email_not_confirmed: "email_not_confirmed",
};

export const mapSupabaseAuthError = (error: AuthError | null): AuthErrorState => {
  if (!error) {
    return null;
  }

  const normalizedCode =
    AUTH_ERROR_CODE_MAP[error.message.toLowerCase()] ??
    AUTH_ERROR_CODE_MAP[error.code ?? ""] ??
    error.code;

  return {
    code: normalizedCode,
    message: error.message,
  };
};
