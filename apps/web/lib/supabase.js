import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_ variables are available in the browser.
// The anon key is safe to expose — Row Level Security limits what it can do.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
