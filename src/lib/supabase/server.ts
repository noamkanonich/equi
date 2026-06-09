import { createServerSupabaseClient } from "@/lib/supabase/supabase";

export {
  createServerSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/supabase";

/** @deprecated Use createServerSupabaseClient from @/lib/supabase/supabase */
export const createSupabaseServerClient = () => createServerSupabaseClient();
