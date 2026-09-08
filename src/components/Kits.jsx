import { KITS } from '../data/store';
import KitCard from './KitCard';
import SectionHead from './SectionHead';

export default function Kits() {
  return (
    <section id="kits" className="bg-white/50 py-20 md:py-32">
      <div className="wrap">
        <SectionHead
          tag="Kits e presentes"
          title={<>Prontos pra<br /><em className="not-italic text-orchid">presentear.</em></>}
          lead="Formatos especiais — bandeja, molde ou combo com chocolate. Como o formato foge do pote simples, o orçamento e o frete são combinados direto no WhatsApp."
        />

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {KITS.map((k) => (
            <KitCard key={k.id} k={k} />
          ))}
        </div>
      </div>
    </section>
  );
}
