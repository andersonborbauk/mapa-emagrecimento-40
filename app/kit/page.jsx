'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import LockedModal from '@/components/LockedModal';
import BottomNav from '@/components/BottomNav';

export default function KitPage() {
  const router = useRouter();
  const [usuaria, setUsuaria] = useState(null);
  const [cardAberto, setCardAberto] = useState(null);

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) { router.push('/'); return; }
      const { data } = await supabase.from('usuarias').select('*').eq('id', userData.user.id).maybeSingle();
      setUsuaria(data);
    }
    carregar();
  }, [router]);

  if (!usuaria) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Carregando...</div>;
  }

  const cards = [
    { id: 'plano', titulo: 'Plano da Semana', desc: 'Seu cardápio completo dia a dia', icon: '📋', locked: false, href: '/plano' },
    { id: 'lista', titulo: 'Lista de Compras', desc: 'Tudo que você precisa comprar', icon: '🛒', locked: false, href: '/lista-compras' },
    {
      id: 'doces', titulo: 'Doces Permitidos', desc: 'Sobremesas sem culpa', icon: '🍫',
      locked: !usuaria.doce_pode_40, produto: 'Doce Pode 40+', linkCheckout: 'https://kiwify.com.br/SEU-LINK-DOCE',
    },
    {
      id: 'chas', titulo: 'Chás e Sucos', desc: 'Bebidas que aceleram o metabolismo', icon: '🥤',
      locked: !usuaria.desincha_40, produto: 'DesinCHÁ 40+', linkCheckout: 'https://kiwify.com.br/SEU-LINK-CHA',
    },
  ];

  return (
    <div className="px-6 py-8 pb-28">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Kit da Transformação</h1>
      <p className="text-inkSoft text-sm mb-5">Tudo o que você precisa em um só lugar.</p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => (card.locked ? setCardAberto(card) : router.push(card.href))}
            className="bg-white border border-border rounded-2xl p-4 text-left"
          >
            <div className="text-2xl mb-2">{card.locked ? '🔒' : card.icon}</div>
            <div className="font-display font-semibold text-sm text-ink mb-1">{card.titulo}</div>
            <div className="text-xs text-inkSoft leading-snug">{card.desc}</div>
            <div className={`inline-block mt-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              card.locked ? 'bg-locked/40 text-inkSoft' : 'bg-[#E4F0E8] text-success'
            }`}>
              {card.locked ? 'Bloqueado' : 'Aberto'}
            </div>
          </button>
        ))}
      </div>

      <LockedModal card={cardAberto} onClose={() => setCardAberto(null)} />
      <BottomNav />
    </div>
  );
}
