'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [usuaria, setUsuaria] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function buscar(e) {
    e.preventDefault();
    setErro('');
    setUsuaria(null);
    setCarregando(true);
    const res = await fetch('/api/admin/buscar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setCarregando(false);
    if (!res.ok) {
      setErro(data.error || 'Erro ao buscar.');
      return;
    }
    setUsuaria(data.usuaria);
  }

  async function alternar(campo) {
    const novoValor = !usuaria[campo];
    setUsuaria((u) => ({ ...u, [campo]: novoValor }));
    await fetch('/api/admin/atualizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuariaId: usuaria.id,
        doce_pode_40: campo === 'doce_pode_40' ? novoValor : usuaria.doce_pode_40,
        desincha_40: campo === 'desincha_40' ? novoValor : usuaria.desincha_40,
      }),
    });
  }

  return (
    <div className="px-6 py-8 max-w-md mx-auto">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">Admin</h1>
      <p className="text-inkSoft text-sm mb-5">Buscar cliente e liberar order bumps manualmente.</p>

      <form onSubmit={buscar} className="flex gap-2 mb-5">
        <input
          type="email"
          required
          placeholder="E-mail da cliente"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button type="submit" disabled={carregando} className="bg-primary text-white rounded-full px-5 text-sm font-semibold">
          {carregando ? '...' : 'Buscar'}
        </button>
      </form>

      {erro && <p className="text-primaryDeep text-sm mb-4">{erro}</p>}

      {usuaria && (
        <div className="bg-white border border-border rounded-2xl p-4">
          <p className="text-sm text-ink font-semibold mb-1">{usuaria.nome || '(sem nome)'}</p>
          <p className="text-xs text-inkSoft mb-4">{usuaria.email}</p>

          <div className="flex items-center justify-between py-2.5 border-t border-border">
            <span className="text-sm text-ink">Doce Pode 40+</span>
            <button
              onClick={() => alternar('doce_pode_40')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                usuaria.doce_pode_40 ? 'bg-success text-white' : 'bg-locked/40 text-inkSoft'
              }`}
            >
              {usuaria.doce_pode_40 ? 'Liberado' : 'Bloqueado'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5 border-t border-border">
            <span className="text-sm text-ink">DesinCHÁ 40+</span>
            <button
              onClick={() => alternar('desincha_40')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                usuaria.desincha_40 ? 'bg-success text-white' : 'bg-locked/40 text-inkSoft'
              }`}
            >
              {usuaria.desincha_40 ? 'Liberado' : 'Bloqueado'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
