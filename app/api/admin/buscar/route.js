import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabaseServer';
import { createClientAdmin, emailEhAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  const supabaseAuth = createClientServer();
  const { data: sessionData } = await supabaseAuth.auth.getUser();

  if (!sessionData?.user || !emailEhAdmin(sessionData.user.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
  }

  const { email } = await request.json();
  const admin = createClientAdmin();

  // busca o usuário no Auth pelo email, pra achar o id
  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers();
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }
  const usuarioAuth = usersData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!usuarioAuth) {
    return NextResponse.json({ error: 'Nenhuma cliente encontrada com esse e-mail.' }, { status: 404 });
  }

  const { data: perfil, error: perfilError } = await admin
    .from('usuarias')
    .select('*')
    .eq('id', usuarioAuth.id)
    .maybeSingle();

  if (perfilError) {
    return NextResponse.json({ error: perfilError.message }, { status: 500 });
  }

  return NextResponse.json({ usuaria: { ...perfil, email: usuarioAuth.email } });
}
