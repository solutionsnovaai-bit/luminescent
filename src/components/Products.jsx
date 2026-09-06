import { PRODUCTS, PRICE, brl } from '../data/store';
import ProductCard from './ProductCard';
import SectionHead from './SectionHead';

export default function Products({ onAdd, onOpen }) {
  return (
    <section id="velas" className="py-20 md:py-32">
      <div className="wrap">
        <SectionHead
          tag="Nossas velas"
          title={<>Cinco aromas,<br /><em className="not-italic text-orchid">um preço só.</em></>}
          lead={`Toda a linha sai por ${brl(PRICE)}. Escolha pelo aroma, não pelo bolso.`}
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
