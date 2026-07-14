import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

const supabase = createClient(

      process.env.NEXT_PUBLIC_SUPABASE_URL,

      process.env.SUPABASE_SERVICE_ROLE_KEY

    );

export async function POST(request) {

  try {

        const body = await request.json();

        const evento = body?.event;

        const email = body?.customer?.email || body?.data?.customer?.email;

        if (!email) {

            return NextResponse.json({ error: 'Email nao encontrado' }, { status: 400 });

        }

        // Evento de compra aprovada ou pedido pago
        if (evento === 'purchase.approved' || evento === 'order.paid') {

            try {

                    const { error } = await supabase

                      .from('pending_permissions')

                      .upsert(
                          { email, main_plan: true },
                          { onConflict: 'email' }
                                    );

                    if (error) {

                          console.error('Supabase upsert error:', error);

                          return NextResponse.json({ error: error.message }, { status: 500 });

                    }

                    return NextResponse.json({ success: true, email, evento, action: 'upsert_pending_permissions' }, { status: 200 });

            } catch (dbError) {

                    console.error('Database error:', dbError);

                    return NextResponse.json({ error: 'Erro ao atualizar pending_permissions' }, { status: 500 });

            }

        }

        // Evento de reembolso ou chargeback
        if (evento === 'reembolso' || evento === 'chargeback') {

            try {

                    const { error } = await supabase

                      .from('pending_permissions')

                      .update({ main_plan: false })

                      .eq('email', email);

                    if (error) {

                          console.error('Supabase update error:', error);

                          return NextResponse.json({ error: error.message }, { status: 500 });

                    }

                    return NextResponse.json({ success: true, email, evento, action: 'update_main_plan_false' }, { status: 200 });

            } catch (dbError) {

                    console.error('Database error:', dbError);

                    return NextResponse.json({ error: 'Erro ao atualizar pending_permissions' }, { status: 500 });

            }

        }

        return NextResponse.json({ received: true, evento }, { status: 200 });

  } catch (err) {

        console.error('Webhook error:', err);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

  }

}
