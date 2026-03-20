import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only admin client — never import in client components
let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || url.startsWith("your_")) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured. Set it in Vercel environment variables.");
    }
    if (!key || key.startsWith("your_")) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured. Set it in Vercel environment variables.");
    }
    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}
