'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { createClientBrowser } from '@/lib/supabaseClient';
import StatPill from '@/components/StatPill';
import BottomNav from '@/components/BottomNav';

export default function EvolucaoPage() {
  const router = useRouter();
  const [dados, setDados] = useState(null);
  const [usuaria, setUsuaria] = useState(null);

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) { router.push('/'); return; }
      const userId = userData.user.id;

      const { data: perfil } = await supabase.from('usuarias').select('*').eq('id', userId).maybeSingle();
      setUsuaria(perfil);

      const { data: checkins } = await supabase
        .from('checkins_semanais')
        .select('*')
        .eq('usuaria_id', userId)
        .order('numero_semana', { ascending: true });

      const pontos = [{ semana: 'Início', peso: perfil.peso_inicial }, ...(checkins || []).map((c) => ({
        semana: `S${c.numero_semana}`,
        peso: c.peso,
      }))];
      setDados(pontos);
    }
    carregar();
  }, [router]);

  if (!dados || !usuaria) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Carregando sua evolução...</div>;
  }

  const perdido = (usuaria.peso_inicial - usuaria.peso_atual).toFixed(1);

  return (
    <div className="px-6 py-8 pb-28">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Minha Evolução</h1>
      <p className="text-inkSoft text-sm mb-5">Prova de que você está no caminho.</p>

      <div className="bg-white rounded-2xl border border-border p-3 mb-4" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#F0DFD8" vertical={false} />
            <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#8A7472' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8A7472' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #F0DFD8', fontSize: 12 }} />
            <Line type="monotone" dataKey="peso" stroke="#B23A55" strokeWidth={3} dot={{ r: 4, fill: '#B23A55' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatPill label="Perdido até aqui" value={`${perdido} kg`} icon="↘" />
        <StatPill label="Check-ins" value={dados.length - 1} icon="✓" />
      </div>

      <BottomNav />
    </div>
  );
}
