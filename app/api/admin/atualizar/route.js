import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabaseServer';
import { createClientAdmin, emailEhAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  const supabaseAuth = createClientServer();
  const { data: sessionData } = await supabaseAuth.auth.getUser();

  if (!sessionData?.user || !emailEhAdmin(sessionData.user.email)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
  }

  const { usuariaId, doce_pode_40, desincha_40 } = await request.json();
  const admin = createClientAdmin();

  const { error } = await admin
    .from('usuarias')
    .update({ doce_pode_40, desincha_40 })
    .eq('id', usuariaId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
