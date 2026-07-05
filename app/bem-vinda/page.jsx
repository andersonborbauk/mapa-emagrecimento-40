'use client';

import { useRouter } from 'next/navigation';

export default function BemVindaPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-8 bg-gradient-to-br from-bg to-[#F0D8CD]">
      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl mb-6 shadow-lg shadow-primary/30">
        ♡
      </div>
      <p className="text-primary font-bold text-xs tracking-widest uppercase">
        Mapa do Emagrecimento 40+
      </p>
      <h1 className="font-display font-semibold text-3xl text-ink mt-3 mb-2">
        Seu mapa está pronto
      </h1>
      <p className="text-inkSoft text-sm max-w-[260px] leading-relaxed">
        Vamos precisar de alguns dados seus pra deixar tudo do seu jeito. Leva menos de 2 minutos.
      </p>
      <button
        onClick={() => router.push('/meus-dados')}
        className="mt-8 bg-primary text-white rounded-full px-9 py-3.5 text-sm font-semibold shadow-lg shadow-primary/30"
      >
        Começar
      </button>
    </div>
  );
}
