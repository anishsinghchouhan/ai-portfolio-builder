import { createClient } from "@supabase/supabase-js";

// Safe fallback credentials so the frontend can run offline / preview mode without crashing
const FALLBACK_URL = "https://dummy-project.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key-frontend-preview";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isConfigured = Boolean(
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

if (import.meta.env.DEV) {
  let host = "NONE";
  try {
    host = new URL(supabaseUrl).hostname;
  } catch {
    host = "INVALID_URL";
  }
  const keyPrefix = supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + "..." : "NONE";

  if (!isConfigured) {
    console.info(
      `[Supabase Frontend Preview Mode] Running with mock credentials. Live auth is simulated for frontend inspection.`
    );
  } else {
    console.log(`[Supabase Initialized] Host: ${host}, Key Prefix: ${keyPrefix}`);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export default supabase;
