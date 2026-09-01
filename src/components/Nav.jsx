import { useEffect, useState } from 'react';
import { BRAND } from '../data/store';
import { Bag, Insta } from './Icons';

const LINKS = [
  { href: '#velas', label: 'Velas' },
  { href: '#personalizados', label: 'Personalizados' },
  { href: '#sobre', label: 'Quem faz' },
  { href: '#cuidados', label: 'Cuidados' },
];

export default function Nav({ count, onOpenCart }) {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ease-soft
                    ${stuck ? 'border-b border-plum/10 bg-lilac-mist/85 py-3 text-plum backdrop-blur-md' : 'py-5 text-cream'}`}
      >
        <div className="wrap flex items-center gap-6">
          <a href="#topo" className="mr-auto flex flex-col leading-none" aria-label="Início">
            <span className="font-display text-xl tracking-[0.2em]">LUMINESCENT</span>
            <span className={"label mt-1 text-[8px] " + (stuck ? "text-plum/45" : "text-cream/55")}>by naara carreira</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={"group relative py-1 text-[13.5px] transition-colors " + (stuck ? "text-plum/70 hover:text-plum" : "text-cream/75 hover:text-cream")}
                >
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-orchid transition-transform duration-300 ease-soft group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={"hidden transition-colors sm:block " + (stuck ? "text-plum/55 hover:text-orchid" : "text-cream/65 hover:text-cream")}
            aria-label="Instagram"
          >
            <Insta className="h-[18px] w-[18px]" />
          </a>

          <button
            onClick={onOpenCart}
            className={"relative flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-colors " + (stuck ? "border-plum/20 text-plum hover:border-plum hover:bg-plum/5" : "border-cream/30 text-cream hover:border-cream hover:bg-cream/10")}
            aria-label={`Sacola com ${count} ${count === 1 ? 'item' : 'itens'}`}
          >
            <Bag className="h-[17px] w-[17px]" />
            <span className="hidden sm:inline">Sacola</span>
            {count > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-orchid px-1 text-[11px] font-medium text-white">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenu((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[6px] lg:hidden"
            aria-label="Menu"
            aria-expanded={menu}
          >
            <i className={"h-px w-5 transition-transform duration-300 " + (stuck || menu ? "bg-plum" : "bg-cream") + (menu ? " translate-y-[3.5px] rotate-45" : "")} />
            <i className={"h-px w-5 transition-transform duration-300 " + (stuck || menu ? "bg-plum" : "bg-cream") + (menu ? " -translate-y-[3.5px] -rotate-45" : "")} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[75] flex flex-col items-center justify-center gap-2 bg-lilac-mist
                    transition-all duration-400 ease-soft lg:hidden
                    ${menu ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenu(false)}
            className="h-display py-2 text-3xl text-plum"
          >
            {l.label}
          </a>
        ))}
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-6 text-plum/50"
        >
          @{BRAND.instagram}
        </a>
      </div>
    </>
  );
}
