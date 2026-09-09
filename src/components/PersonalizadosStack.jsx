import { useCallback, useEffect, useRef, useState } from 'react';
import { PERSONALIZADOS_EXEMPLOS } from '../data/store';

const AUTO_MS = 4500;

/**
 * Cartas em pilha, como um pequeno baralho: a de cima em foco, as outras
 * espiadas atrás, levemente giradas. Clicar numa carta de trás (ou num
 * ponto de navegação) traz ela pra frente. Avança sozinho a cada alguns
 * segundos, e reinicia a contagem sempre que a pessoa interage.
 */
export default function PersonalizadosStack() {
  const n = PERSONALIZADOS_EXEMPLOS.length;
  const [active, setActive] = useState(0);
  const reducedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (reducedRef.current) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % n);
    }, AUTO_MS);
  }, [n]);

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, [restartTimer]);

  const goTo = (i) => {
    setActive(i);
    restartTimer();
  };

  // posição de cada carta relativa à ativa: 0 = frente, 1 = logo atrás, 2 = mais atrás
  const offsetOf = (i) => (i - active + n) % n;

  const STYLES = [
    'z-30 scale-100 rotate-0 translate-x-0 translate-y-0 opacity-100',
    'z-20 scale-[.92] rotate-6 translate-x-7 translate-y-5 opacity-90',
    'z-10 scale-[.86] -rotate-6 -translate-x-5 translate-y-9 opacity-75',
  ];

  return (
    <figure className="reveal relative">
      <div className="relative aspect-[4/5] w-full">
        {PERSONALIZADOS_EXEMPLOS.map((ex, i) => {
          const offset = offsetOf(i);
          const isActive = offset === 0;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => !isActive && goTo(i)}
              aria-label={isActive ? undefined : `Ver: ${ex.caption}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? -1 : 0}
              className={`absolute inset-0 overflow-hidden rounded-sm border border-cream/15
                          shadow-[0_30px_60px_-24px_rgba(0,0,0,.6)]
                          transition-all duration-700 ease-soft will-change-transform
                          ${isActive ? 'cursor-default' : 'cursor-pointer hover:border-cream/30'} ${STYLES[offset]}`}
            >
              <img
                src={ex.image}
                alt={ex.caption}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>

      <figcaption className="label mt-8 flex items-center gap-4 border-l-2 border-orchid-glow pl-4 text-cream/50">
        <span className="min-w-0">{PERSONALIZADOS_EXEMPLOS[active].caption}</span>
      </figcaption>

      <div className="mt-4 flex gap-2 pl-4" role="tablist" aria-label="Exemplos de lembrancinhas">
        {PERSONALIZADOS_EXEMPLOS.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Exemplo ${i + 1}: ${ex.caption}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-400 ease-soft
                        ${i === active ? 'w-7 bg-orchid-glow' : 'w-1.5 bg-cream/25 hover:bg-cream/45'}`}
          />
        ))}
      </div>
    </figure>
  );
}
