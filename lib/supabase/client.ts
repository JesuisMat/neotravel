import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client browser unique via @supabase/ssr.
// La session est stockée dans des COOKIES (pas localStorage) →
// le middleware/proxy peut la lire côté serveur pour protéger les routes.
export function createBrowserClient() {
  return createSSRBrowserClient(url, anonKey);
}
