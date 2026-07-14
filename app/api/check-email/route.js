import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

const supabase = createClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL,

    process.env.SUPABASE_SERVICE_ROLE_KEY

  );

export async function POST(request) {

    try {

          const body = await request.json();

          const email = body?.email;

          if (!email) {

                  return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });

                }

          // Buscar permissões do usuário
          const { data: permissions, error: permError } = await supabase

            .from('pending_permissions')

            .select('main_plan')

            .eq('email', email)

            .single();

          if (permError && permError.code !== 'PGRST116') {

                  console.error('Supabase error:', permError);

                  return NextResponse.json({ error: 'Erro ao verificar permissões' }, { status: 500 });

                }

          // Se não encontrou registro ou main_plan é false → acesso revogado
          if (!permissions || permissions.main_plan === false) {

                  return NextResponse.json(

                            { status: 'acesso_revogado', mensagem: 'Seu acesso foi revogado. Contacte suporte@emagrecimento40.com' },

                            { status: 200 }

                          );

                }

          // Acesso ativo
          return NextResponse.json({ status: 'acesso_ativo', email }, { status: 200 });

        } catch (err) {

          console.error('Check email error:', err);

          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

        }

  }
