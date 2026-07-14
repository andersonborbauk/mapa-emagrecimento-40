import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

const supabase = createClient(

        process.env.NEXT_PUBLIC_SUPABASE_URL,

        process.env.SUPABASE_SERVICE_ROLE_KEY

      );

// Função auxiliar para verificar se a compra foi aprovada
function isApprovedPurchase(evento) {

  return evento === 'purchase.approved' || 

                 evento === 'purchase_approved' || 

                 evento === 'order.paid' ||

                 evento === 'order_paid';

}

// Função para verificar se o webhook tem autorização válida (verifica secret)
function isCaktoWebhookAuthorized(body, request) {
          const secretEnv = process.env.CAKTO_WEBHOOK_SECRET;

          // Candidatos de autenticação em ordem de prioridade:
          // 1. Body.secret (enviado pela Cakto no corpo da requisição)
          // 2. Header x-webhook-secret
          // 3. Header x-cakto-secret
          // 4. Query param secret

          const bodySecret = body?.secret;
          const headerSecret = request.headers.get('x-webhook-secret') || request.headers.get('x-cakto-secret');
          const querySecret = request.nextUrl.searchParams.get('secret');

          const providedSecret = bodySecret || headerSecret || querySecret;

          return providedSecret === secretEnv;
}


export async function POST(request) {

  try {

          const body = await request.json();

              // Verifica se o webhook tem autorização válida
              if (!isCaktoWebhookAuthorized(body, request)) {
                            return NextResponse.json({ error: 'Unauthorized - Invalid secret' }, { status: 401 });
              }


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

                      (evento === 'reembolso' || evento === 'reembolso_event' || 
                       
                                  evento === 'chargeback' || evento === 'chargeback_event' || 
                       
                                  evento === 'payment.failed' || evento === 'payment_failed' || 
                       
                                  evento === 'refund.completed' || evento === 'refund_completed')) {{

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
