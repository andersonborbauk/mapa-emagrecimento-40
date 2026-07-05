'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';
import BottomNav from '@/components/BottomNav';

export default function PerfilPage() {
  const router = useRouter();
  const [usuaria, setUsuaria] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function carregar() {
      const supabase = createClientBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) { router.push('/'); return; }
      setEmail(userData.user.email);
      const { data } = await supabase.from('usuarias').select('*').eq('id', userData.user.id).single();
      setUsuaria(data);
    }
    carregar();
  }, [router]);

  async function handleSair() {
    const supabase = createClientBrowser();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (!usuaria) {
    return <div className="px-6 py-10 text-center text-inkSoft text-sm">Carregando...</div>;
  }

  const linhas = [
    { label: 'Nome', value: usuaria.nome },
    { label: 'E-mail', value: email },
    { label: 'Peso atual', value: `${usuaria.peso_atual} kg` },
    { label: 'Meta', value: `${usuaria.meta_kg || '—'} kg` },
  ];

  return (
    <div className="px-6 py-8 pb-28">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Perfil</h1>
      <p className="text-inkSoft text-sm mb-5">Seus dados, só seus.</p>

      <div className="bg-white rounded-2xl border border-border divide-y divide-border">
        {linhas.map((l) => (
          <div key={l.label} className="flex justify-between px-4 py-3.5 text-sm">
            <span className="text-inkSoft">{l.label}</span>
            <span className="text-ink font-semibold">{l.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/meus-dados')}
        className="w-full mt-3.5 border-[1.5px] border-primary text-primary rounded-2xl py-3 text-sm font-semibold"
      >
        Editar dados
      </button>
      <button onClick={handleSair} className="w-full mt-2.5 text-inkSoft text-sm py-2">
        Sair
      </button>

      <BottomNav />
    </div>
  );
}
