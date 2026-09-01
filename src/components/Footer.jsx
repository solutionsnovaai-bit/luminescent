import { BRAND, PRODUCTS, waLink } from '../data/store';
import { Insta, Wpp } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-plum-ink pt-16 text-cream/70">
      <div className="wrap grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <img src="/assets/logo.png" alt="LUMINESCENT" className="mb-5 w-[210px]" />
          <p className="max-w-xs text-[14px] leading-relaxed text-cream/55">
            Velas aromáticas artesanais, veganas, feitas à mão em pequenos lotes.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label mb-1 text-orchid-glow">Velas</span>
          {PRODUCTS.map((p) => (
            <a key={p.id} href="#velas" className="text-[14px] transition-colors hover:text-cream">{p.name}</a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="label mb-1 text-orchid-glow">Contato</span>
          <a href={waLink('Olá Naara!')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[14px] transition-colors hover:text-cream">
            <Wpp className="h-4 w-4" /> {BRAND.whatsappLabel}
          </a>
          <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[14px] transition-colors hover:text-cream">
            <Insta className="h-4 w-4" /> @{BRAND.instagram}
          </a>
          <a href="#personalizados" className="text-[14px] transition-colors hover:text-cream">Lembrancinhas</a>
          <a href="#cuidados" className="text-[14px] transition-colors hover:text-cream">Cuidados com a vela</a>
        </div>
      </div>

      <div className="wrap border-t border-cream/10 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="label text-[9px] text-cream/35">
            © {year} {BRAND.name} · {BRAND.by.toLowerCase()}
          </span>
          <span className="label text-[9px] text-cream/25">Nova AI Solutions</span>
        </div>
      </div>
    </footer>
  );
}
