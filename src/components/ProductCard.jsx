import { brl } from '../data/store';

export default function ProductCard({ p, onAdd, onOpen }) {
  return (
    <article className="reveal group flex flex-col">
      <button
        onClick={() => onOpen(p)}
        className="relative mb-5 block overflow-hidden rounded-sm bg-white/60"
        aria-label={`Ver detalhes de ${p.name}`}
      >
        <img
          src={p.image}
          alt={`Vela aromática ${p.name}`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
        />
        {p.collection && (
          <span className="label absolute left-3 top-3 rounded-full bg-lilac-mist/90 px-3 py-1.5 text-[9px] text-plum">
            {p.collection}
          </span>
        )}
        <span className="pointer-events-none absolute inset-0 bg-plum/0 transition-colors duration-500 group-hover:bg-plum/5" />
      </button>

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
