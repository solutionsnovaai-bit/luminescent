import { FAQ } from '../data/store';
import SectionHead from './SectionHead';

export default function Faq() {
  return (
    <section id="duvidas" className="py-20 md:py-28">
      <div className="wrap max-w-3xl">
        <SectionHead tag="Dúvidas" title={<>Perguntas que<br /><em className="not-italic text-orchid">todo mundo faz.</em></>} />

        <div className="border-t border-plum/12">
          {FAQ.map((f) => (
            <details key={f.q} className="reveal group border-b border-plum/12">
              <summary className="h-display flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(18px,2.3vw,23px)] text-plum transition-colors hover:text-orchid [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="relative h-4 w-4 flex-none">
                  <i className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-orchid" />
                  <i className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-orchid transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="pb-7 pr-10 text-[15px] leading-relaxed text-plum-ink/65">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
