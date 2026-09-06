import { useState } from 'react';
import useReveal from './hooks/useReveal';
import useCart from './hooks/useCart';

import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Products from './components/Products';
import ProductModal from './components/ProductModal';
import Personalizados from './components/Personalizados';
import Sobre from './components/Sobre';
import Cuidados from './components/Cuidados';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer';
import FloatWpp from './components/FloatWpp';
import CartDrawer from './components/CartDrawer';

export default function App() {
  const cart = useCart();
  const [detail, setDetail] = useState(null);
  useReveal();

  return (
    <>
      <Loader />
      <Nav count={cart.count} onOpenCart={() => cart.setOpen(true)} />

      <main>
        <Hero />
        <Marquee />
        <Products onAdd={cart.add} onOpen={setDetail} />
        <Personalizados />
        <Sobre />
        <Cuidados />
        <Faq />
        <Cta />
      </main>

      <Footer />
      <FloatWpp />

      <ProductModal p={detail} onClose={() => setDetail(null)} onAdd={cart.add} />
      <CartDrawer
        open={cart.open}
        onClose={() => cart.setOpen(false)}
        lines={cart.lines}
        subtotal={cart.subtotal}
        shipping={cart.shipping}
        total={cart.total}
        add={cart.add}
        dec={cart.dec}
        remove={cart.remove}
        cep={cart.cep}
        setCep={cart.setCep}
        shippingOptions={cart.shippingOptions}
        selectedShipping={cart.selectedShipping}
        shippingLoading={cart.shippingLoading}
        shippingError={cart.shippingError}
        calculateShipping={cart.calculateShipping}
        selectShipping={cart.selectShipping}
        startCheckout={cart.startCheckout}
        checkingOut={cart.checkingOut}
        checkoutError={cart.checkoutError}
      />
    </>
  );
}
