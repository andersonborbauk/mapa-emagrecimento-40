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
          const produtoId = body?.product?.id || body?.data?.product?.id;

          if (!email) {
                  return NextResponse.json({ error: 'Email nao encontrado' }, { status: 400 });
                }

          if (evento === 'purchase.approved' || evento === 'order.paid') {
                  const { error } = await supabase
                    .from('profiles')
                    .update({ is_active: true, produto_id: produtoId })
                    .eq('email', email);

                  if (error) {
                            console.error('Supabase error:', error);
                            return NextResponse.json({ error: error.message }, { status: 500 });
                          }

                  return NextResponse.json({ success: true, email, evento }, { status: 200 });
                }

          return NextResponse.json({ received: true, evento }, { status: 200 });
        } catch (err) {
          console.error('Webhook error:', err);
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
  }
