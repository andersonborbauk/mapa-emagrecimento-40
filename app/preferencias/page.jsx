'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import { PROTEINAS, listarCarboidratosPorTipo } from '@/lib/alimentos';

function ChipGroup({ titulo, opcoes, selecionados, onToggle }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-primaryDeep uppercase tracking-wide mb-2">{titulo}</h3>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((op) => {
          const ativo = selecionados.includes(op.id);
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => onToggle(op.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border ${
                ativo ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-border'
              }`}
            >
              {op.nome}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PreferenciasPage() {
  const router = useRouter();
  const [proteinas, setProteinas] = useState([]);
  const [carboidratos, setCarboidratos] = useState([]);
  const [erro, setErro] = useState('');

  const proteinasComidas = PROTEINAS.filter((p) => !p.adequadoCeia || p.porcaoBaseG); // exibe todas, inclusive as leves
  const graos = listarCarboidratosPorTipo('grao');
  const tuberculos = listarCarboidratosPorTipo('tuberculo');

  function toggle(lista, setLista, id) {
    setLista((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));
  }

  async function handleContinuar() {
    if (proteinas.length < 2 || carboidratos.length < 1) {
      setErro('Escolha pelo menos 2 proteínas e 1 carboidrato pra continuar.');
      return;
    }
    const supabase = createClientBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (userId) {
      await supabase.from('usuarias').update({
        preferencia_proteinas: proteinas,
        preferencia_carboidratos: carboidratos,
      }).eq('id', userId);
    }
    router.push('/refeicoes');
  }

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Minhas Preferências</h1>
      <p className="text-inkSoft text-sm mb-6">Escolha o que você gosta — seu plano roda só com isso.</p>

      <ChipGroup
        titulo="Proteínas"
        opcoes={PROTEINAS}
        selecionados={proteinas}
        onToggle={(id) => toggle(proteinas, setProteinas, id)}
      />

      <ChipGroup
        titulo="Carboidrato do almoço — grãos"
        opcoes={graos}
        selecionados={carboidratos}
        onToggle={(id) => toggle(carboidratos, setCarboidratos, id)}
      />

      <ChipGroup
        titulo="Carboidrato do almoço — tubérculos"
        opcoes={tuberculos}
        selecionados={carboidratos}
        onToggle={(id) => toggle(carboidratos, setCarboidratos, id)}
      />

      {erro && <p className="text-primaryDeep text-xs mb-3">{erro}</p>}

      <button
        onClick={handleContinuar}
        className="w-full bg-primary text-white rounded-full py-3.5 font-semibold text-sm mt-2"
      >
        Continuar
      </button>
    </div>
  );
}
