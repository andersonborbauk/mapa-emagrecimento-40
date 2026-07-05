import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cliente pra usar em Server Components / Route Handlers (app/api/**)
// NUNCA importar este arquivo de dentro de um Client Component ("use client") —
// use lib/supabaseClient.js pra isso.
export function createClientServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // chamado de um Server Component sem permissão de escrita — ok ignorar
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {}
        },
      },
    }
  );
}
