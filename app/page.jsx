'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientBrowser } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    const supabase = createClientBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      setErro('E-mail ou senha incorretos.');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl mx-auto mb-4">
          ♡
        </div>
        <p className="text-primary font-bold text-xs tracking-widest uppercase">
          Mapa do Emagrecimento 40+
        </p>
        <h1 className="font-display font-semibold text-2xl text-ink mt-2">Bem-vinda de volta</h1>
        <p className="text-inkSoft text-sm mt-1">Seu mapa pessoal, só seu.</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
          placeholder="Senha"
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
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-inkSoft mt-4">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-primary font-semibold">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
