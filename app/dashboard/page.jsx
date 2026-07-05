'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import { calcularNumeroSemanaAtual } from '@/lib/plano';
import { calcularTMB } from '@/lib/porcao';
import StatPill from '@/components/StatPill';
import BottomNav from '@/components/BottomNav';

const NOMES_BLOQUEIO = {
  HOR: 'Desequilíbrio Hormonal',
  ACU: 'Açúcar-dependente',
  INF: 'Inflamação e Retenção',
  EST: 'Metabolismo Estagnado',
};

export default function DashboardPage() {
  const router = useRouter();
  const [usuaria, setUsuaria] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        router.push('/');
        return;
      }
      const { data } = await supabase.from('usuarias').select('*').eq('id', userData.user.id).single();
      setUsuaria(data);
      setCarregando(false);
    }
    carregar();
  }, [router]);

  if (carregando || !usuaria) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Carregando seu mapa...</div>;
  }

  const numeroSemana = calcularNumeroSemanaAtual(usuaria.data_cadastro);
  const tmb = usuaria.altura_cm && usuaria.peso_atual && usuaria.idade
    ? Math.round(calcularTMB({ pesoKg: usuaria.peso_atual, alturaCm: usuaria.altura_cm, idade: usuaria.idade }))
    : null;

  const pesoInicial = usuaria.peso_inicial || 0;
  const pesoAtual = usuaria.peso_atual || pesoInicial;
  const meta = usuaria.meta_kg || pesoInicial;
  const totalPerder = pesoInicial - meta;
  const jaPerdeu = pesoInicial - pesoAtual;
  const progresso = totalPerder > 0 ? Math.min(100, Math.max(0, Math.round((jaPerdeu / totalPerder) * 100))) : 0;
  const idadeMetabolica = tmb ? Math.max(18, Math.round(usuaria.idade + (tmb - 1650) / -20)) : usuaria.idade;

  return (
    <div className="px-6 py-8 pb-28">
      <h1 className="font-display font-semibold text-2xl text-ink">
        {numeroSemana < 1 ? 'Preparando seu mapa' : `Semana ${numeroSemana}`}
      </h1>
      <p className="text-inkSoft text-sm mb-5">
        {numeroSemana < 1 ? 'Seu plano começa na próxima segunda-feira.' : 'Cada dia conta.'}
      </p>

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <StatPill label="Peso inicial" value={`${pesoInicial} kg`} icon="↘" />
        <StatPill label="Peso atual" value={`${pesoAtual} kg`} icon="●" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <StatPill label="Meta" value={`${meta} kg`} icon="◎" />
        <StatPill label="Idade metabólica" value={`${idadeMetabolica} anos`} icon="✦" />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-border mb-4">
        <div className="flex justify-between text-xs text-inkSoft mb-2">
          <span>Início {pesoInicial}kg</span>
          <span className="text-primary font-bold">Perdeu {jaPerdeu.toFixed(1)}kg</span>
          <span>Meta {meta}kg</span>
        </div>
        <div className="h-2 rounded-full bg-lavenderSoft overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-coral to-primary"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <div className="bg-lavenderSoft rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-6">
        <span className="text-xl">🔥</span>
        <div>
          <div className="text-[10px] font-bold text-primaryDeep uppercase tracking-wide">Bloqueio identificado</div>
          <div className="font-display font-semibold text-base text-ink">
            {NOMES_BLOQUEIO[usuaria.bloqueio] || 'A definir'}
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/hoje')}
        className="w-full bg-ink text-white rounded-2xl py-3.5 font-semibold text-sm"
      >
        Continuar meu plano →
      </button>

      <BottomNav />
    </div>
  );
}
