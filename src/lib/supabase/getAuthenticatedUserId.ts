import { getCurrentUser } from "@/services/auth/auth.service";

/** Returns the authenticated Supabase user id, or null when not signed in. */
export const getAuthenticatedUserId = async (): Promise<string | null> => {
  const { user } = await getCurrentUser();
  return user?.id ?? null;
};
