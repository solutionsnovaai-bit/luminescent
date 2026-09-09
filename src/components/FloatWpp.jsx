import { useEffect, useState } from 'react';
import { waLink } from '../data/store';
import { Wpp } from './Icons';

export default function FloatWpp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <a
      href={waLink('Olá Naara! Vim pelo site da Luminescent.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={`fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-plum text-cream
                  shadow-[0_14px_34px_-8px_rgba(74,14,122,.7)] transition-all duration-400 ease-soft
                  hover:bg-orchid ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`}
    >
      <Wpp className="h-7 w-7" />
    </a>
  );
}
