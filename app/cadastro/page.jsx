'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientBrowser } from '@/lib/supabaseClient';

export default function CadastroPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleCadastro(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    const supabase = createClientBrowser();
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }
    if (data.user) {
      // cria a linha inicial em `usuarias`, com data de cadastro = hoje
      await supabase.from('usuarias').insert({
        id: data.user.id,
        data_cadastro: new Date().toISOString(),
      });
    }
    setCarregando(false);
    router.push('/bem-vinda');
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="font-display font-semibold text-2xl text-ink">Criar sua conta</h1>
        <p className="text-inkSoft text-sm mt-1">Vamos montar seu mapa em poucos passos.</p>
      </div>

      <form onSubmit={handleCadastro} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-border rounded-full px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Crie uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border border-border rounded-full px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {erro && <p className="text-primaryDeep text-xs text-center">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="bg-primary text-white rounded-full py-3 font-semibold text-sm mt-1 disabled:opacity-60"
        >
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </div>
  );
}
