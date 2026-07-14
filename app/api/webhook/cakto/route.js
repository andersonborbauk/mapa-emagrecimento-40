import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

const supabase = createClient(

        process.env.NEXT_PUBLIC_SUPABASE_URL,

        process.env.SUPABASE_SERVICE_ROLE_KEY

      );

// Função auxiliar para verificar se a compra foi aprovada
function isApprovedPurchase(evento) {

  return evento === 'purchase.approved' || evento === 'order.paid';

}

export async function POST(request) {

  try {

          const body = await request.json();

            console.log('CAKTO PAYLOAD COMPLETO:', JSON.stringify(body, null, 2));

          const evento = body?.event;

          const email = body?.customer?.email || body?.data?.customer?.email;

          if (!email) {

              return NextResponse.json({ error: 'Email nao encontrado' }, { status: 400 });

          }

          // Evento de compra aprovada: conceder acesso
          if (isApprovedPurchase(evento)) {

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

                        return NextResponse.json({ success: true, email, evento, action: 'access_granted' }, { status: 200 });

              } catch (dbError) {

                        console.error('Database error:', dbError);

                        return NextResponse.json({ error: 'Erro ao conceder acesso' }, { status: 500 });

              }

          }

          // Evento de revogação: reembolso, chargeback, etc
          if (isApprovedPurchase(evento) === false && 

                      (evento === 'reembolso' || evento === 'chargeback' || evento === 'payment.failed' || evento === 'refund.completed')) {

              try {

                        const { error } = await supabase

                          .from('pending_permissions')

                          .update({ main_plan: false })

                          .eq('email', email);

                        if (error) {

                              console.error('Supabase update error:', error);

                              return NextResponse.json({ error: error.message }, { status: 500 });

                        }

                        return NextResponse.json({ success: true, email, evento, action: 'access_revoked' }, { status: 200 });

              } catch (dbError) {

                        console.error('Database error:', dbError);

                        return NextResponse.json({ error: 'Erro ao revogar acesso' }, { status: 500 });

              }

          }

          return NextResponse.json({ received: true, evento }, { status: 200 });

  } catch (err) {

          console.error('Webhook error:', err);

          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

  }

}
