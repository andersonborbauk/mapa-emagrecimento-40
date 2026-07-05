import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: este cliente ignora RLS (Row Level Security).
// Só pode ser usado em rotas de servidor (app/api/**), nunca exposto ao browser,
// e sempre depois de checar que o e-mail de quem está pedindo está em ADMIN_EMAILS.
export function createClientAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function emailEhAdmin(email) {
  const permitidos = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase());
  return permitidos.includes((email || '').toLowerCase());
}
