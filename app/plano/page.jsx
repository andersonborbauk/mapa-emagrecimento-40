'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import { montarPlanoSemanal } from '@/lib/plano';
import { calcularTMB } from '@/lib/porcao';
import BottomNav from '@/components/BottomNav';

const LABELS_REFEICAO = { cafe: 'Café da manhã', almoco: 'Almoço', lanche: 'Lanche da tarde', jantar: 'Jantar', ceia: 'Ceia' };

export default function PlanoPage() {
  const router = useRouter();
  const [plano, setPlano] = useState(null);
  const [diaAberto, setDiaAberto] = useState(0);

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) { router.push('/'); return; }
      const { data: usuaria } = await supabase.from('usuarias').select('*').eq('id', userData.user.id).maybeSingle();

      const tmb = calcularTMB({ pesoKg: usuaria.peso_atual, alturaCm: usuaria.altura_cm, idade: usuaria.idade });
      const planoSemanal = montarPlanoSemanal({
        refeicoesAtivas: usuaria.refeicoes_ativas,
        preferencias: { proteinas: usuaria.preferencia_proteinas, carboidratos: usuaria.preferencia_carboidratos },
        tmb,
      });
      setPlano(planoSemanal);
    }
    carregar();
  }, [router]);

  if (!plano) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Montando seu plano...</div>;
  }

  const diaAtual = plano[diaAberto];

  return (
    <div className="px-6 py-8 pb-28">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Plano da Semana</h1>
      <p className="text-inkSoft text-sm mb-4">Seu cardápio completo, dia a dia.</p>

      <div className="flex gap-1.5 overflow-x-auto mb-5 pb-1">
        {plano.map((d, i) => (
          <button
            key={d.dia}
            onClick={() => setDiaAberto(i)}
            className={`px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${
              i === diaAberto ? 'bg-primary text-white' : 'bg-white text-inkSoft border border-border'
            }`}
          >
            {d.dia}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(diaAtual.refeicoes).map(([id, refeicao]) => (
          <details key={id} className="bg-white rounded-2xl border border-border p-4 group">
            <summary className="font-display font-semibold text-sm text-ink cursor-pointer">
              {LABELS_REFEICAO[id]}
            </summary>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {refeicao.itens.map((item, idx) => (
                <li key={idx} className="text-sm text-inkSoft flex justify-between">
                  <span>{item.nome}</span>
                  {item.quantidade && <span className="text-ink font-medium">{item.quantidade}</span>}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
