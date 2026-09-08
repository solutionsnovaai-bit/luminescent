const WORDS = ['100% vegana', 'feita à mão', 'pequenos lotes', 'sem teste em animais', 'cera vegetal'];

export default function Marquee() {
  const row = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-plum/10 bg-plum py-3.5" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center whitespace-nowrap">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="label flex items-center text-cream/85">
                {w}
                <i className="mx-6 text-[7px] not-italic text-orchid-glow">◆</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
