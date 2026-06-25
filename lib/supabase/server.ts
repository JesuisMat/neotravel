import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client Supabase côté serveur respectant la session utilisateur (RLS actif).
 * Lit les cookies de session posés par le client browser.
 * À utiliser dans les Server Components et Server Actions.
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Appelé depuis un Server Component — ignoré.
        }
      },
    },
  });
}

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Client Supabase avec service_role (bypass RLS).
 * UNIQUEMENT dans les routes API server-side. Ne jamais exposer au browser.
 */
export function createAdminClient() {
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
