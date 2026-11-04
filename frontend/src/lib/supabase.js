import { createClient } from "@supabase/supabase-js";

// Fallback credentials for safe development fallback when env variables are not set
const FALLBACK_URL = "https://dummy-project.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key-frontend-preview";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  !rawUrl.includes("dummy-project") &&
  !rawUrl.includes("your-project-ref") &&
  !rawUrl.includes("placeholder") &&
  rawKey &&
  !rawKey.includes("dummy-anon-key") &&
  !rawKey.includes("your-supabase-anon-key") &&
  !rawKey.includes("replace_with_actual")
);

const supabaseUrl = rawUrl || FALLBACK_URL;
const supabaseAnonKey = rawKey || FALLBACK_KEY;

if (import.meta.env.DEV && !isSupabaseConfigured) {
  console.warn(
    "[Supabase Frontend Warning] Running with placeholder credentials. Live auth requires valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
