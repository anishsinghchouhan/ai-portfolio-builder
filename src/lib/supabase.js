import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Validate environment variables in development
if (!supabaseUrl || supabaseUrl.includes("demo-project.supabase.co")) {
  console.error(
    "[Supabase] Invalid or missing VITE_SUPABASE_URL. Check your .env file.\n" +
    "Get your real URL from Supabase Dashboard → Project Settings → API"
  );
}

if (!supabaseAnonKey || supabaseAnonKey.includes("replace_with_actual")) {
  console.error(
    "[Supabase] Invalid or missing public key. Set VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.\n" +
    "Get your key from Supabase Dashboard → Project Settings → API"
  );
}

if (import.meta.env.DEV) {
  const host = supabaseUrl ? new URL(supabaseUrl).hostname : "NONE";
  const keyPrefix = supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + "..." : "NONE";
  console.log(`[Supabase Initialized] Host: ${host}, Key Prefix: ${keyPrefix}`);
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // PKCE flow is required for secure email verification redirects
    flowType: "pkce",
  },
});

export default supabase;
