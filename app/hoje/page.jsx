'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import { calcularNumeroSemanaAtual } from '@/lib/plano';
import { cotaDocesDaSemana } from '@/lib/receitas';
import BottomNav from '@/components/BottomNav';

const LABELS_REFEICAO = {
  cafe: { label: 'Café da manhã', icon: '☕' },
  almoco: { label: 'Almoço', icon: '🍽️' },
  lanche: { label: 'Lanche da tarde', icon: '🍎' },
  jantar: { label: 'Jantar', icon: '🌙' },
  ceia: { label: 'Ceia', icon: '🌜' },
};

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function HojePage() {
  const router = useRouter();
  const [usuaria, setUsuaria] = useState(null);
  const [concluidos, setConcluidos] = useState({});
  const [docesUsadosSemana, setDocesUsadosSemana] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        router.push('/');
        return;
      }
      const userId = userData.user.id;
      const { data: perfil } = await supabase.from('usuarias').select('*').eq('id', userId).single();
      setUsuaria(perfil);

      const { data: missoes } = await supabase
        .from('missao_diaria')
        .select('*')
        .eq('usuaria_id', userId)
        .eq('data', hojeISO());
      const mapa = {};
      (missoes || []).forEach((m) => { mapa[m.item] = m.concluido; });
      setConcluidos(mapa);

      const numeroSemana = calcularNumeroSemanaAtual(perfil.data_cadastro);
      const { count } = await supabase
        .from('extras_usados')
        .select('*', { count: 'exact', head: true })
        .eq('usuaria_id', userId)
        .eq('tipo', 'doce')
        .eq('numero_semana', numeroSemana);
      setDocesUsadosSemana(count || 0);

      setCarregando(false);
    }
    carregar();
  }, [router]);

  async function toggleItem(item) {
    const supabase = createClientBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const novoValor = !concluidos[item];
    setConcluidos((c) => ({ ...c, [item]: novoValor }));
    await supabase.from('missao_diaria').upsert({
      usuaria_id: userData.user.id,
      data: hojeISO(),
      item,
      concluido: novoValor,
    }, { onConflict: 'usuaria_id,data,item' });
  }

  async function usarDoceHoje() {
    const supabase = createClientBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const numeroSemana = calcularNumeroSemanaAtual(usuaria.data_cadastro);
    await supabase.from('extras_usados').insert({
      usuaria_id: userData.user.id,
      tipo: 'doce',
      data: hojeISO(),
      numero_semana: numeroSemana,
    });
    setDocesUsadosSemana((n) => n + 1);
  }

  if (carregando || !usuaria) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Carregando sua missão...</div>;
  }

  const refeicoesAtivas = Object.entries(usuaria.refeicoes_ativas || {})
    .filter(([, ativa]) => ativa)
    .map(([id]) => id);
  const totalItens = refeicoesAtivas.length;
  const feitos = refeicoesAtivas.filter((id) => concluidos[id]).length;
  const completo = totalItens > 0 && feitos === totalItens;

  const numeroSemana = calcularNumeroSemanaAtual(usuaria.data_cadastro);
  const cotaDoces = cotaDocesDaSemana(Math.max(1, numeroSemana));
  const docesRestantes = Math.max(0, cotaDoces - docesUsadosSemana);

  return (
    <div className="px-6 py-8 pb-28">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">Minha Missão de Hoje</h1>
          <p className="text-inkSoft text-sm">Um passo por vez.</p>
        </div>
        <div className="bg-primary text-white rounded-full px-3 py-1 text-xs font-bold">
          {feitos}/{totalItens}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mb-6">
        {refeicoesAtivas.map((id) => {
          const info = LABELS_REFEICAO[id];
          const feito = !!concluidos[id];
          return (
            <button
              key={id}
              onClick={() => toggleItem(id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left ${
                feito ? 'bg-[#F6EDE9] border-coral/40' : 'bg-white border-border'
              }`}
            >
              <span className="text-lg">{info.icon}</span>
              <span className={`flex-1 text-sm text-ink ${feito ? 'line-through opacity-60' : ''}`}>
                {info.label}
              </span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                feito ? 'bg-success border-success text-white' : 'border-locked text-transparent'
              }`}>
                ✓
              </span>
            </button>
          );
        })}
      </div>

      {completo && (
        <div className="bg-gradient-to-br from-coral to-primary rounded-2xl p-4 text-center text-white mb-6">
          <div className="text-xl mb-1">🎉</div>
          <div className="font-display font-semibold text-base">Missão completa!</div>
          <div className="text-xs opacity-90">Que orgulho de você, {usuaria.nome}.</div>
        </div>
      )}

      <h2 className="text-xs font-bold text-primaryDeep uppercase tracking-wide mb-2">Seus extras</h2>
      <div className="bg-white rounded-2xl border border-border p-4 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-ink">🍫 Doce da semana</span>
          <span className="text-xs text-inkSoft">{docesRestantes} restante(s)</span>
        </div>
        <p className="text-xs text-inkSoft mb-3">Melhor aproveitar após o almoço, mas o horário é livre.</p>
        <button
          onClick={usarDoceHoje}
          disabled={docesRestantes <= 0}
          className="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          {docesRestantes > 0 ? 'Usar meu doce hoje' : 'Cota da semana usada'}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
