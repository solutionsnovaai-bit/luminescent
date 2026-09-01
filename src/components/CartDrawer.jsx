import { useEffect } from 'react';
import { brl } from '../data/store';
import { Close, Wpp } from './Icons';

export default function CartDrawer({ open, onClose, lines, total, add, dec, remove, checkoutUrl }) {
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return (
    <>
      <button
        onClick={onClose}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        aria-label="Fechar sacola"
        className={`fixed inset-0 z-[90] bg-plum-ink/50 backdrop-blur-sm transition-opacity duration-400
                    ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        className={`fixed right-0 top-0 z-[92] flex h-[100svh] w-full max-w-[420px] flex-col bg-lilac-mist
                    shadow-2xl transition-transform duration-500 ease-soft
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Sacola"
      >
        <div className="flex items-center justify-between border-b border-plum/10 px-6 py-5">
          <h2 className="h-display text-2xl text-plum">Sua sacola</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-plum transition-colors hover:bg-plum/5" aria-label="Fechar">
            <Close className="h-4 w-4" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-[15px] text-plum-ink/55">Sua sacola está vazia.</p>
            <button onClick={onClose} className="btn btn-ghost">Ver as velas</button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-plum/10 overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-4 py-5">
                  <img src={l.image} alt="" className="h-24 w-[76px] rounded-sm object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="h-display text-lg leading-tight text-plum">{l.name}</h3>
                        <span className="font-micro text-[12px] text-plum/45">{l.weight}</span>
                      </div>
                      <button onClick={() => remove(l.id)} className="label text-[9px] text-plum/40 transition-colors hover:text-orchid">
                        remover
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="flex items-center rounded-full border border-plum/20">
                        <button onClick={() => dec(l.id)} className="h-8 w-8 text-plum transition-colors hover:text-orchid" aria-label={`Menos um ${l.name}`}>−</button>
                        <span className="w-6 text-center font-micro text-[13px] text-plum">{l.qty}</span>
                        <button onClick={() => add(l.id)} className="h-8 w-8 text-plum transition-colors hover:text-orchid" aria-label={`Mais um ${l.name}`}>+</button>
                      </div>
                      <span className="font-display text-lg text-plum">{brl(l.qty * l.price)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-plum/10 px-6 py-6">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="label text-plum/50">Total</span>
                <span className="font-display text-3xl text-plum">{brl(total)}</span>
              </div>
              <p className="mb-5 text-[12.5px] leading-relaxed text-plum-ink/50">
                O frete é calculado no WhatsApp, pelo seu CEP.
              </p>
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-plum w-full">
                <Wpp className="h-4 w-4" />
                Finalizar no WhatsApp
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
