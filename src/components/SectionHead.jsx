export default function SectionHead({ tag, title, lead, light = false, center = false }) {
  return (
    <div className={`mb-12 max-w-2xl md:mb-16 ${center ? 'mx-auto text-center' : ''}`}>
      <span className={`label reveal mb-5 inline-flex items-center gap-3 ${light ? 'text-orchid-glow' : 'text-orchid'}`}>
        <i className={`h-px w-6 ${light ? 'bg-orchid-glow/60' : 'bg-orchid/50'}`} />
        {tag}
      </span>
      <h2 className={`h-display reveal text-[clamp(30px,5vw,54px)] ${light ? 'text-cream' : 'text-plum'}`}>
        {title}
      </h2>
      {lead && (
        <p className={`reveal mt-5 text-[15.5px] leading-relaxed ${light ? 'text-cream/70' : 'text-plum-ink/65'}`}>
          {lead}
        </p>
      )}
    </div>
  );
}
