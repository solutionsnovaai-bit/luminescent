import { CARE } from '../data/store';
import SectionHead from './SectionHead';
import { Flame } from './Icons';

export default function Cuidados() {
  return (
    <section id="cuidados" className="bg-white/50 py-20 md:py-28">
      <div className="wrap">
        <SectionHead
          tag="Cuidados"
          title={<>Para a vela durar<br /><em className="not-italic text-orchid">o quanto deve.</em></>}
          lead="Quatro hábitos simples que mudam a queima, o aroma e a vida útil da sua vela."
        />

        <ol className="grid gap-px overflow-hidden rounded-sm bg-plum/10 sm:grid-cols-2 lg:grid-cols-4">
          {CARE.map((c) => (
            <li key={c.n} className="reveal group bg-lilac-mist p-7 transition-colors duration-500 hover:bg-white">
              <span className="font-display text-4xl text-orchid/50 transition-colors duration-500 group-hover:text-orchid">
                {c.n}
              </span>
              <h3 className="h-display mb-2 mt-4 text-xl text-plum">{c.title}</h3>
              <p className="text-[14px] leading-relaxed text-plum-ink/60">{c.text}</p>
            </li>
          ))}
        </ol>

        <p className="reveal mt-8 flex items-start gap-3 border-l-2 border-orchid pl-5 text-[13.5px] leading-relaxed text-plum-ink/60">
          <Flame className="mt-0.5 h-4 w-4 flex-none text-orchid" />
          <span>
            Na primeira vez, deixe acesa até a cera derreter até a borda do pote —
            é isso que evita que a vela abra um túnel no centro e desperdice cera.
          </span>
        </p>
      </div>
    </section>
  );
}
