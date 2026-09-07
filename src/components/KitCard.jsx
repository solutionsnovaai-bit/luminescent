import { brl, waLink } from '../data/store';
import { Wpp } from './Icons';

export default function KitCard({ k }) {
  return (
    <article className="reveal flex flex-col">
      <div className="relative mb-5 overflow-hidden rounded-sm bg-white/60">
        <img
          src={k.image}
          alt={k.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>

      <h3 className="h-display text-2xl text-plum">{k.name}</h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-plum-ink/60">{k.description}</p>

      <div className="mt-5 flex items-center gap-4 pt-1">
        <span className="font-display text-2xl text-plum">{brl(k.price)}</span>
        <a
          href={waLink(`Olá Naara! Quero saber mais sobre o ${k.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-plum ml-auto !px-6 !py-2.5 !text-[13px]"
        >
          <Wpp className="h-3.5 w-3.5" />
          Pedir orçamento
        </a>
      </div>
    </article>
  );
}
