import { createBrowserClient } from '@supabase/ssr';

// Cliente pra usar em Client Components ("use client")
// Este arquivo NUNCA deve importar "next/headers" - isso quebra o build
// quando o arquivo é importado por componentes de cliente.
export function createClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
