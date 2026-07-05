'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import { montarPlanoSemanal } from '@/lib/plano';
import { gerarListaDeCompras } from '@/lib/listaCompras';
import { calcularTMB } from '@/lib/porcao';
import BottomNav from '@/components/BottomNav';

function Secao({ titulo, itens }) {
  if (!itens || itens.length === 0) return null;
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-primaryDeep uppercase tracking-wide mb-2">{titulo}</h3>
      <div className="bg-white rounded-2xl border border-border divide-y divide-border">
        {itens.map((item, i) => (
          <div key={i} className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-ink">{item.nome}</span>
            <span className="text-inkSoft font-medium">{item.quantidade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ListaComprasPage() {
  const router = useRouter();
  const [lista, setLista] = useState(null);

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) { router.push('/'); return; }
      const { data: usuaria } = await supabase.from('usuarias').select('*').eq('id', userData.user.id).single();

      const tmb = calcularTMB({ pesoKg: usuaria.peso_atual, alturaCm: usuaria.altura_cm, idade: usuaria.idade });
      const planoSemanal = montarPlanoSemanal({
        refeicoesAtivas: usuaria.refeicoes_ativas,
        preferencias: { proteinas: usuaria.preferencia_proteinas, carboidratos: usuaria.preferencia_carboidratos },
        tmb,
      });
      setLista(gerarListaDeCompras(planoSemanal));
    }
    carregar();
  }, [router]);

  if (!lista) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Montando sua lista...</div>;
  }

  return (
    <div className="px-6 py-8 pb-28">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Lista de Compras</h1>
      <p className="text-inkSoft text-sm mb-5">Baseada no seu plano desta semana.</p>

      <Secao titulo="Proteínas" itens={lista.proteinas} />
      <Secao titulo="Grãos e tubérculos" itens={lista.carboidratos} />
      <Secao titulo="Legumes" itens={lista.legumes} />
      <Secao titulo="Saladas" itens={lista.saladas} />

      <BottomNav />
    </div>
  );
}
