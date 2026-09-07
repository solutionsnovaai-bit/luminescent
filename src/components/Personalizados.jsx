import { BRAND, waLink } from '../data/store';
import SectionHead from './SectionHead';
import { Wpp } from './Icons';

const OCASIOES = ['Casamento', 'Aniversário', 'Chá de bebê', 'Batizado', 'Formatura', 'Corporativo'];

export default function Personalizados() {
  return (
    <section id="personalizados" className="bg-plum-deep py-20 text-cream md:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <figure className="reveal relative order-2 lg:order-1">
          <img
            src="/assets/produtos/personalizada.jpg"
            alt="Vela personalizada com rótulo de casamento"
            loading="lazy"
            className="w-full rounded-sm object-cover"
          />
          <figcaption className="label mt-4 border-l-2 border-orchid-glow pl-4 text-cream/50">
            lembrança de casamento · rótulo personalizado
          </figcaption>
        </figure>

        <div className="order-1 lg:order-2">
          <SectionHead
            light
            tag="Personalizados"
            title={<>Sua festa cabe<br /><em className="not-italic text-orchid-glow">numa vela.</em></>}
            lead="Lembrancinhas feitas sob medida: você escolhe o aroma, a cor, o rótulo e a embalagem. Produzimos por encomenda, com prazo combinado antes de você fechar a data."
          />

          <ul className="reveal mb-9 flex flex-wrap gap-2">
            {OCASIOES.map((o) => (
              <li key={o} className="label rounded-full border border-cream/20 px-4 py-2 text-[9.5px] text-cream/75">
                {o}
              </li>
            ))}
          </ul>

          <a
            href={waLink('Olá Naara! Quero um orçamento de lembrancinhas personalizadas.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light reveal"
          >
            <Wpp className="h-4 w-4" />
            Pedir orçamento
          </a>
          <p className="reveal mt-4 text-[13px] text-cream/45">
            Orçamento por quantidade — responde a própria {BRAND.by.replace('BY ', '')
              .toLowerCase()
              .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}.
          </p>
        </div>
      </div>
    </section>
  );
}
