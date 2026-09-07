export default function Hero() {
  return (
    <header id="topo" className="relative isolate min-h-[100svh] overflow-hidden bg-plum-ink">
      {/* ── DESKTOP: asset com o logo sangrando pela direita ── */}
      <img
        src="/assets/hero-desktop.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full scale-[1.06] object-cover object-right md:block"
        fetchPriority="high"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[78%] bg-gradient-to-r from-plum-ink via-plum-ink/92 to-transparent md:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-plum-ink to-transparent md:block" />

      {/* ── MOBILE: gradiente próprio, sem depender da proporção do arquivo ── */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: 'radial-gradient(120% 55% at 50% 26%, #B45BD8 0%, #7B23A8 34%, #43106E 62%, #1A0530 100%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60 md:hidden"
        style={{ background: 'radial-gradient(60% 26% at 50% 24%, rgba(230,199,245,.55), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="wrap relative flex min-h-[100svh] flex-col md:justify-center">
        <img
          src="/assets/logo.png"
          alt="LUMINESCENT by Naara Carreira"
          className="mx-auto mt-[18svh] w-[88%] max-w-sm md:hidden"
          fetchPriority="high"
        />

        <div className="mb-16 mt-auto max-w-[27rem] md:mb-0 md:mt-0">
          <span className="label reveal mb-5 inline-flex items-center gap-3 text-cream/70">
            <i className="h-1.5 w-1.5 rounded-full bg-orchid-glow" />
            velas artesanais · são paulo
          </span>

          <h1 className="h-display reveal mb-6 text-[clamp(34px,4vw,52px)] text-cream">
            Acender uma vela<br />
            <em className="not-italic text-orchid-glow">é mudar o ambiente</em><br />
            em um minuto.
          </h1>

          <p className="reveal mb-9 text-[15.5px] leading-relaxed text-cream/75">
            Feitas à mão, em pequenos lotes, 100% veganas. Cada aroma é composto
            para uma hora do dia — e para durar mais do que o primeiro acendimento.
          </p>

          <div className="reveal flex flex-wrap gap-3">
            <a href="#velas" className="btn btn-light">Ver as velas</a>
            <a href="#personalizados" className="btn border border-cream/35 text-cream hover:bg-cream/10">
              Lembrancinhas
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
