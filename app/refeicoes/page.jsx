'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';

const REFEICOES = [
  { id: 'cafe', label: 'Café da manhã', icon: '☕' },
  { id: 'almoco', label: 'Almoço', icon: '🍽️' },
  { id: 'lanche', label: 'Lanche da tarde', icon: '🍎' },
  { id: 'jantar', label: 'Jantar', icon: '🌙' },
  { id: 'ceia', label: 'Ceia', icon: '🌜' },
];

const MINIMO = 3;

export default function RefeicoesPage() {
  const router = useRouter();
  const [ativas, setAtivas] = useState({ cafe: true, almoco: true, jantar: true, lanche: false, ceia: false });
  const [salvando, setSalvando] = useState(false);

  const quantidadeAtiva = Object.values(ativas).filter(Boolean).length;

  function toggle(id) {
    setAtivas((atual) => {
      const novoValor = !atual[id];
      // impede desmarcar se isso deixaria menos que o mínimo
      if (!novoValor && quantidadeAtiva <= MINIMO) return atual;
      return { ...atual, [id]: novoValor };
    });
  }

  async function handleContinuar() {
    setSalvando(true);
    const supabase = createClientBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (userId) {
      await supabase.from('usuarias').update({ refeicoes_ativas: ativas }).eq('id', userId);
    }
    setSalvando(false);
    router.push('/dashboard');
  }

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Quais refeições você faz?</h1>
      <p className="text-inkSoft text-sm mb-6">
        Escolha no mínimo {MINIMO}. Qualquer combinação funciona — se você faz jejum e começa no almoço, sem problema.
      </p>

      <div className="flex flex-col gap-2.5 mb-6">
        {REFEICOES.map((r) => {
          const ativa = ativas[r.id];
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left ${
                ativa ? 'bg-[#F6EDE9] border-coral/60' : 'bg-white border-border'
              }`}
            >
              <span className="text-lg">{r.icon}</span>
              <span className="flex-1 text-sm text-ink font-medium">{r.label}</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                ativa ? 'bg-success border-success text-white' : 'border-locked text-transparent'
              }`}>
                ✓
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-inkSoft text-center mb-4">
        {quantidadeAtiva} de 5 refeições ativas {quantidadeAtiva === MINIMO && '(mínimo atingido)'}
      </p>

      <button
        onClick={handleContinuar}
        disabled={salvando}
        className="w-full bg-primary text-white rounded-full py-3.5 font-semibold text-sm disabled:opacity-60"
      >
        {salvando ? 'Salvando...' : 'Ver meu mapa'}
      </button>
    </div>
  );
}
