import { useRef, useState } from 'react';
import { brl } from '../data/store';
import { Layers } from './Icons';

const SWIPE_THRESHOLD = 40;

export default function ProductCard({ p, onAdd, onOpen }) {
  const [showAlt, setShowAlt] = useState(false);
  const touchX = useRef(null);
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
    <article className="reveal group flex flex-col">
      <div className="relative mb-5 overflow-hidden rounded-sm bg-white/60">
        <button
          onClick={() => onOpen(p)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="block w-full"
          aria-label={`Ver detalhes de ${p.name}`}
        >
          <img
            key={shownImage}
            src={shownImage}
            alt={`Vela aromática ${p.name}`}
            loading="lazy"
            className="aspect-[4/5] w-full animate-fadeIn object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
          />
          {p.collection && (
            <span className="label absolute left-3 top-3 rounded-full bg-lilac-mist/90 px-3 py-1.5 text-[9px] text-plum">
              {p.collection}
            </span>
          )}
          <span className="pointer-events-none absolute inset-0 bg-plum/0 transition-colors duration-500 group-hover:bg-plum/5" />
        </button>

        {hasAlt && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowAlt((v) => !v); }}
            aria-label={showAlt ? 'Ver foto original' : 'Ver versão em cera bicolor'}
            className="group/badge absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center overflow-hidden
                       rounded-sm border-2 border-white/80 shadow-lg transition-transform duration-300 ease-soft hover:scale-105"
          >
            <img src={badgeImage} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-plum-ink/25 opacity-0 transition-opacity duration-300 group-hover/badge:opacity-100">
              <Layers className="h-3.5 w-3.5 text-white" />
            </span>
          </button>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="h-display text-2xl text-plum">{p.name}</h3>
        <span className="font-micro text-[13px] text-plum/50">{p.weight}</span>
      </div>
      <p className="label mt-1 text-[9.5px] text-orchid">{p.tagline}</p>
      <p className="mt-3 text-[14.5px] leading-relaxed text-plum-ink/60">{p.description}</p>

      <div className="mt-5 flex items-center gap-4 pt-1">
        <span className="font-display text-2xl text-plum">{brl(p.price)}</span>
        <button onClick={() => onAdd(p.id)} className="btn btn-plum ml-auto !px-6 !py-2.5 !text-[13px]">
          Adicionar
        </button>
      </div>
    </article>
  );
}
