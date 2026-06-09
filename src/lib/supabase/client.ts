import { createBrowserSupabaseClient } from "@/lib/supabase/supabase";

export {
  createBrowserSupabaseClient,
  getSupabaseBrowserClient,
  isSupabaseConfigured,
  supabaseBrowserClient,
} from "@/lib/supabase/supabase";

/** @deprecated Use createBrowserSupabaseClient from @/lib/supabase/supabase */
export const createSupabaseClient = () => createBrowserSupabaseClient();
