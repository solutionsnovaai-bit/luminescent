import { BRAND, waLink } from '../data/store';
import { Wpp, Insta } from './Icons';

export default function Cta() {
  return (
    <section id="contato" className="relative isolate overflow-hidden bg-plum-deep py-24 text-center text-cream md:py-32">
      <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orchid/25 blur-[110px]" />

      <div className="wrap">
        <span className="label reveal mb-6 inline-block text-orchid-glow">Vamos conversar</span>
        <h2 className="h-display reveal mx-auto mb-5 max-w-2xl text-[clamp(30px,5.4vw,58px)]">
          Escolheu o aroma?<br />
          <em className="not-italic text-orchid-glow">O resto a gente combina.</em>
        </h2>
        <p className="reveal mx-auto mb-10 max-w-lg text-[15.5px] leading-relaxed text-cream/70">
          Monte sua sacola aqui e finalize no WhatsApp, ou chame direto se tiver
          qualquer dúvida sobre aroma, prazo ou frete.
        </p>

        <div className="reveal flex flex-wrap justify-center gap-3">
          <a
            href={waLink('Olá Naara! Vim pelo site da Luminescent.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light"
          >
            <Wpp className="h-4 w-4" />
            {BRAND.whatsappLabel}
          </a>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border border-cream/35 text-cream hover:bg-cream/10"
          >
            <Insta className="h-4 w-4" />
            @{BRAND.instagram}
          </a>
        </div>
      </div>
    </section>
  );
}
