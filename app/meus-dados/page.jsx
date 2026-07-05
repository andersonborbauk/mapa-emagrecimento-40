'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';

export default function MeusDadosPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '', idade: '', altura_cm: '', peso_inicial: '',
    braco_cm: '', peito_cm: '', cintura_cm: '', quadril_cm: '',
  });
  const [salvando, setSalvando] = useState(false);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    const supabase = createClientBrowser();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (userId) {
      await supabase.from('usuarias').update({
        nome: form.nome,
        idade: Number(form.idade),
        altura_cm: Number(form.altura_cm),
        peso_inicial: Number(form.peso_inicial),
        peso_atual: Number(form.peso_inicial),
      }).eq('id', userId);

      await supabase.from('medidas_corporais').insert({
        usuaria_id: userId,
        braco_cm: form.braco_cm ? Number(form.braco_cm) : null,
        peito_cm: form.peito_cm ? Number(form.peito_cm) : null,
        cintura_cm: form.cintura_cm ? Number(form.cintura_cm) : null,
        quadril_cm: form.quadril_cm ? Number(form.quadril_cm) : null,
      });
    }
    setSalvando(false);
    router.push('/preferencias');
  }

  const campo = (label, key, tipo = 'text', placeholder = '') => (
    <div className="mb-3">
      <label className="text-xs font-semibold text-inkSoft block mb-1">{label}</label>
      <input
        type={tipo}
        required={['nome', 'idade', 'altura_cm', 'peso_inicial'].includes(key)}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => set(key, e.target.value)}
        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );

  return (
    <div className="px-6 py-8 pb-24">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Meus Dados</h1>
      <p className="text-inkSoft text-sm mb-6">Isso ajuda a calcular seu plano com precisão.</p>

      <form onSubmit={handleSalvar}>
        <h2 className="text-xs font-bold text-primaryDeep uppercase tracking-wide mb-2">Dados pessoais</h2>
        {campo('Nome', 'nome')}
        {campo('Idade', 'idade', 'number')}
        {campo('Altura (cm)', 'altura_cm', 'number', 'ex: 165')}
        {campo('Peso atual (kg)', 'peso_inicial', 'number', 'ex: 78')}

        <h2 className="text-xs font-bold text-primaryDeep uppercase tracking-wide mt-5 mb-2">
          Medidas corporais (opcional, mas recomendado)
        </h2>

        <div className="flex justify-center mb-3">
          <svg width="90" height="180" viewBox="0 0 90 180" fill="none">
            <circle cx="45" cy="18" r="14" fill="#F0DFD8" />
            <path d="M30 34 Q45 30 60 34 L64 90 Q45 100 26 90 Z" fill="#F0DFD8" />
            <path d="M26 90 Q45 96 64 90 L58 150 Q45 156 32 150 Z" fill="#EFE9F7" />
            <line x1="30" y1="45" x2="15" y2="80" stroke="#B7A6D9" strokeWidth="6" strokeLinecap="round" />
            <line x1="60" y1="45" x2="75" y2="80" stroke="#B7A6D9" strokeWidth="6" strokeLinecap="round" />
            <line x1="35" y1="150" x2="32" y2="178" stroke="#D9CFCB" strokeWidth="8" strokeLinecap="round" />
            <line x1="55" y1="150" x2="58" y2="178" stroke="#D9CFCB" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {campo('Braço (cm)', 'braco_cm', 'number')}
          {campo('Peito (cm)', 'peito_cm', 'number')}
          {campo('Cintura (cm)', 'cintura_cm', 'number')}
          {campo('Quadril (cm)', 'quadril_cm', 'number')}
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-primary text-white rounded-full py-3.5 font-semibold text-sm mt-6 disabled:opacity-60"
        >
          {salvando ? 'Salvando...' : 'Continuar'}
        </button>
      </form>
    </div>
  );
}
