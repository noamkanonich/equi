import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let browserSingleton: SupabaseClient | null | undefined;

export const createBrowserSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const createServerSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getSupabaseBrowserClient = (): SupabaseClient | null => {
  if (browserSingleton !== undefined) {
    return browserSingleton;
  }

  browserSingleton = createBrowserSupabaseClient();
  return browserSingleton;
};

/** Lazy singleton browser client — null when Supabase is not configured. */
export const supabaseBrowserClient = getSupabaseBrowserClient();
