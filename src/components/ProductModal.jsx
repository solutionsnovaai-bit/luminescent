import { useEffect } from 'react';
import { brl } from '../data/store';
import { Close } from './Icons';

export default function ProductModal({ p, onClose, onAdd }) {
  useEffect(() => {
    if (!p) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [p, onClose]);

  if (!p) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={p.name}>
      <button className="absolute inset-0 bg-plum-ink/60 backdrop-blur-sm" onClick={onClose} aria-label="Fechar" />

      <div className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-lilac-mist sm:rounded-sm">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-lilac-mist/90 text-plum transition-colors hover:bg-white"
          aria-label="Fechar"
        >
          <Close className="h-4 w-4" />
        </button>

        <div className="grid sm:grid-cols-2">
          <img src={p.image} alt={`Vela aromática ${p.name}`} className="aspect-[4/5] w-full object-cover" />

          <div className="flex flex-col p-7 sm:p-9">
            <span className="label text-orchid">{p.tagline}</span>
            <h3 className="h-display mt-2 text-4xl text-plum">{p.name}</h3>
            <span className="font-micro mt-1 text-[13px] text-plum/50">{p.weight} · 100% vegana e artesanal</span>

            <p className="mt-5 text-[15px] leading-relaxed text-plum-ink/70">{p.description}</p>

            <div className="mt-6">
              <span className="label mb-3 block text-plum/45">Notas</span>
              <ul className="flex flex-wrap gap-2">
                {p.notes.map((n) => (
                  <li key={n} className="label rounded-full border border-plum/15 px-3 py-1.5 text-[9.5px] text-plum/70">
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex items-center gap-4 pt-8">
              <span className="font-display text-3xl text-plum">{brl(p.price)}</span>
              <button
                onClick={() => { onAdd(p.id); onClose(); }}
                className="btn btn-plum ml-auto"
              >
                Adicionar à sacola
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
