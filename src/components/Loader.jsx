import { useEffect, useState } from 'react';

export default function Loader() {
  const [gone, setGone] = useState(false);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setGone(true), reduced ? 100 : 1500);
    const t2 = setTimeout(() => setDead(true), reduced ? 400 : 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (dead) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-7
                  bg-plum-deep transition-opacity duration-700 ease-soft
                  ${gone ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div className="relative">
        <span className="absolute -inset-16 rounded-full bg-orchid/25 blur-3xl animate-flicker" />
        <img
          src="/assets/logo.png"
          alt=""
          className="relative w-[min(280px,62vw)] opacity-0 animate-fadeUp"
          style={{ animationDelay: '.15s' }}
        />
      </div>
      <span
        className="label text-cream/60 opacity-0 animate-fadeUp"
        style={{ animationDelay: '.6s' }}
      >
        velas artesanais
      </span>
    </div>
  );
}
