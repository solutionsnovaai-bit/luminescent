import { BRAND } from '../data/store';
import SectionHead from './SectionHead';
import { Insta } from './Icons';

const PILARES = [
  { t: 'Feita à mão', d: 'Cada lote é derretido, perfumado e envasado por ela mesma. Nada de linha de produção.' },
  { t: '100% vegana', d: 'Cera vegetal, sem ingrediente de origem animal e sem teste em animais.' },
  { t: 'Pequenos lotes', d: 'Produção em quantidade pequena para manter o padrão do aroma e da queima.' },
];

export default function Sobre() {
  return (
    <section id="sobre" className="relative overflow-hidden py-20 md:py-32">
      <img
        src="/assets/faixa-clara.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 top-0 h-full w-[70%] object-cover opacity-25 blur-[2px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lilac-mist via-lilac-mist/85 to-transparent" />

      <div className="wrap relative max-w-3xl">
        <SectionHead
          tag="Quem faz"
          title={<>Naara Carreira,<br /><em className="not-italic text-orchid">artesã de velas.</em></>}
          lead="Formada em administração, mãe e empresária — e apaixonada por aromas e bem-estar. A Luminescent nasceu dessa mistura: o cuidado de quem faz à mão com a organização de quem entende de negócio."
        />

        <p className="reveal mb-10 max-w-xl text-[15.5px] leading-relaxed text-plum-ink/65">
          Cada vela sai daqui com o nome dela na etiqueta, e isso não é detalhe: é ela
          quem responde no WhatsApp, quem embala e quem escuta se o aroma ficou como
          você esperava.
        </p>

        <ul className="reveal grid gap-px overflow-hidden rounded-sm bg-plum/10 sm:grid-cols-3">
          {PILARES.map((p) => (
            <li key={p.t} className="bg-lilac-mist p-6">
              <h3 className="h-display mb-2 text-xl text-plum">{p.t}</h3>
              <p className="text-[14px] leading-relaxed text-plum-ink/60">{p.d}</p>
            </li>
          ))}
        </ul>

        <a
          href={BRAND.instagramNaara}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal mt-9 inline-flex items-center gap-2 text-[14px] text-plum/60 transition-colors hover:text-orchid"
        >
          <Insta className="h-4 w-4" />
          @naaracarreira
        </a>
      </div>
    </section>
  );
}
