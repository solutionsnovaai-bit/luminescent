import { useEffect, useRef, useState } from 'react';
import { brl } from '../data/store';
import { Close, Layers } from './Icons';

const SWIPE_THRESHOLD = 40;

export default function ProductModal({ p, onClose, onAdd }) {
  const [showAlt, setShowAlt] = useState(false);
  const touchX = useRef(null);

  useEffect(() => {
    if (!p) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [p, onClose]);

  // troca de produto -> sempre volta pra foto principal
  useEffect(() => { setShowAlt(false); }, [p?.id]);

  if (!p) return null;

  const hasAlt = Boolean(p.image2);
  const shownImage = showAlt && hasAlt ? p.image2 : p.image;
  const badgeImage = hasAlt ? (showAlt ? p.image : p.image2) : null;

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!hasAlt || touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) setShowAlt((v) => !v);
    touchX.current = null;
  };

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
          <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <img
              key={shownImage}
              src={shownImage}
              alt={`Vela aromática ${p.name}`}
              className="aspect-[4/5] w-full animate-fadeIn object-cover"
            />
            {hasAlt && (
              <button
                type="button"
                onClick={() => setShowAlt((v) => !v)}
                aria-label={showAlt ? 'Ver foto original' : 'Ver versão em cera bicolor'}
                className="group/badge absolute bottom-4 right-4 flex h-16 w-16 items-center justify-center overflow-hidden
                           rounded-sm border-2 border-white/85 shadow-lg transition-transform duration-300 ease-soft hover:scale-105"
              >
                <img src={badgeImage} alt="" className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-plum-ink/25 opacity-0 transition-opacity duration-300 group-hover/badge:opacity-100">
                  <Layers className="h-4 w-4 text-white" />
                </span>
              </button>
            )}
            {hasAlt && (
              <span className="label pointer-events-none absolute bottom-4 left-4 rounded-full bg-plum-ink/50 px-3 py-1.5 text-[9px] text-white backdrop-blur-sm sm:hidden">
                arraste pra ver mais
              </span>
            )}
          </div>

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
