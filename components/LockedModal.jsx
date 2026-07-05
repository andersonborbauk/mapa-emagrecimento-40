'use client';

export default function LockedModal({ card, onClose }) {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/55 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-xs text-center"
      >
        <div className="text-3xl mb-2">🔒</div>
        <h3 className="font-display font-semibold text-lg text-ink mb-2">
          Desbloqueie esse conteúdo
        </h3>
        <p className="text-sm text-inkSoft mb-4 leading-relaxed">
          &quot;{card.titulo}&quot; faz parte do <strong>{card.produto}</strong>. Libere agora e acelere sua transformação.
        </p>
        <a
          href={card.linkCheckout || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold mb-2"
        >
          Ver oferta
        </a>
        <button
          onClick={onClose}
          className="block w-full bg-transparent text-inkSoft py-2 text-xs"
        >
          Talvez mais tarde
        </button>
      </div>
    </div>
  );
}
