export type AuthUser = {
  id: string;
  email: string;
  createdAt?: string;
  lastSignInAt?: string;
};

export type AuthSession = {
  accessToken: string;
  expiresAt?: number;
};

export type AuthErrorState = {
  code?: string;
  message: string;
} | null;

export type AuthState = {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthLoading: boolean;
  authError: AuthErrorState;
  isAuthenticated: boolean;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
};

export type AuthActionResult = {
  user: AuthUser | null;
  session: AuthSession | null;
  error: AuthErrorState;
  needsEmailConfirmation?: boolean;
};

export type AuthUserResult = {
  user: AuthUser | null;
  error: AuthErrorState;
};

export type AuthSessionResult = {
  session: AuthSession | null;
  error: AuthErrorState;
};

export type AuthSignOutResult = {
  error: AuthErrorState;
};

export type BootstrapAuthResult = {
  user: AuthUser | null;
  session: AuthSession | null;
  error: AuthErrorState;
};

export type AuthMode = "signIn" | "signUp";
