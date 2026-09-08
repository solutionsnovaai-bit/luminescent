import { PRODUCTS } from '../data/store';
import ProductCard from './ProductCard';
import SectionHead from './SectionHead';

export default function Products({ onAdd, onOpen }) {
  return (
    <section id="velas" className="py-20 md:py-32">
      <div className="wrap">
        <SectionHead
          tag="Nossas velas"
          title={<>Um aroma para<br /><em className="not-italic text-orchid">cada hora do dia.</em></>}
          lead="Da linha do dia a dia às edições sazonais, todas 100% veganas e feitas à mão em pequenos lotes."
        />

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
