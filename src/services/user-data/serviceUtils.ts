import { getSupabaseBrowserClient } from "@/lib/supabase/supabase";
import type { ServiceResult } from "@/data/supabase/supabase.types";

export const noOpResult = <T>(): ServiceResult<T> => ({
  data: null,
  error: null,
});

export const successResult = <T>(data: T): ServiceResult<T> => ({
  data,
  error: null,
});

export const errorResult = <T>(message: string): ServiceResult<T> => ({
  data: null,
  error: message,
});

export const getUserDataClient = (userId: string | null | undefined) => {
  if (!userId) {
    return null;
  }

  return getSupabaseBrowserClient();
};

export const resolveSupabaseError = (error: { message: string } | null): string | null =>
  error?.message ?? null;
