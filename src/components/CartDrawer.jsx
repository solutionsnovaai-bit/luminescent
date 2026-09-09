import { useEffect } from 'react';
import { brl } from '../data/store';
import { Clock, Close, Lock, Spinner, Truck, User } from './Icons';

export default function CartDrawer({
  open, onClose, lines, subtotal, shipping, total,
  add, dec, remove,
  cep, setCep, shippingOptions, selectedShipping, shippingLoading, shippingError,
  calculateShipping, selectShipping,
  customerName, setCustomerName, customerPhone, setCustomerPhone,
  street, setStreet, streetNumber, setStreetNumber,
  complement, setComplement, neighborhood, setNeighborhood, addressComplete,
  startCheckout, checkingOut, checkoutError,
}) {
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open, onClose]);

  const handleCalculate = (e) => {
    e.preventDefault();
    calculateShipping();
  };

  const canCheckout = Boolean(selectedShipping) && addressComplete && !checkingOut;
  const inputClass = 'w-full min-w-0 rounded-sm border border-plum/20 bg-white px-4 py-2.5 text-[14px] text-plum outline-none transition-colors focus:border-orchid';

  return (
    <>
      <button
        onClick={onClose}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        aria-label="Fechar sacola"
        className={`fixed inset-0 z-[90] bg-plum-ink/50 backdrop-blur-sm transition-opacity duration-400
                    ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        className={`fixed right-0 top-0 z-[92] flex h-[100svh] w-full max-w-[420px] flex-col bg-lilac-mist
                    shadow-2xl transition-transform duration-500 ease-soft
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Sacola"
      >
        <div className="flex items-center justify-between border-b border-plum/10 px-6 py-5">
          <h2 className="h-display text-2xl text-plum">Sua sacola</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-plum transition-colors hover:bg-plum/5" aria-label="Fechar">
            <Close className="h-4 w-4" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-[15px] text-plum-ink/55">Sua sacola está vazia.</p>
            <button onClick={onClose} className="btn btn-ghost">Ver as velas</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-plum/10">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4 py-5">
                    <img src={l.image} alt="" className="h-24 w-[76px] rounded-sm object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="h-display text-lg leading-tight text-plum">{l.name}</h3>
                          <span className="font-micro text-[12px] text-plum/45">{l.weight}</span>
                        </div>
                        <button onClick={() => remove(l.id)} className="label text-[9px] text-plum/40 transition-colors hover:text-orchid">
                          remover
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-full border border-plum/20">
                          <button onClick={() => dec(l.id)} className="h-8 w-8 text-plum transition-colors hover:text-orchid" aria-label={`Menos um ${l.name}`}>−</button>
                          <span className="w-6 text-center font-micro text-[13px] text-plum">{l.qty}</span>
                          <button onClick={() => add(l.id)} className="h-8 w-8 text-plum transition-colors hover:text-orchid" aria-label={`Mais um ${l.name}`}>+</button>
                        </div>
                        <span className="font-display text-lg text-plum">{brl(l.qty * l.price)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ── Cálculo de frete ── */}
              <div className="border-t border-plum/10 py-5">
                <span className="label mb-3 flex items-center gap-2 text-plum/60">
                  <Truck className="h-4 w-4" />
                  Calcular frete
                </span>

                <form onSubmit={handleCalculate} className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full min-w-0 flex-1 rounded-full border border-plum/20 bg-white px-4 py-2.5 text-[14px] text-plum outline-none transition-colors focus:border-orchid"
                    aria-label="CEP de destino"
                  />
                  <button
                    type="submit"
                    disabled={shippingLoading}
                    className="btn btn-navy shrink-0 !px-5 !py-2.5 !text-[13px] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {shippingLoading ? <Spinner className="h-4 w-4" /> : 'Calcular'}
                  </button>
                </form>

                {shippingError && (
                  <p className="mt-3 text-[13px] leading-relaxed text-red-700">{shippingError}</p>
                )}

                {shippingOptions?.length > 0 && (
                  <fieldset className="mt-4 flex flex-col gap-2">
                    <legend className="sr-only">Escolha uma opção de frete</legend>
                    {shippingOptions.map((opt) => {
                      const checked = selectedShipping?.id === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex cursor-pointer items-center justify-between gap-3 rounded-sm border px-4 py-3 transition-colors
                                      ${checked ? 'border-orchid bg-orchid/5' : 'border-plum/15 hover:border-plum/30'}`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={checked}
                              onChange={() => selectShipping(opt)}
                              className="h-4 w-4 accent-orchid"
                            />
                            <span className="flex flex-col">
                              <span className="text-[14px] font-medium text-plum">
                                {opt.company} {opt.service}
                              </span>
                              {opt.deliveryDays && (
                                <span className="font-micro text-[11.5px] text-plum/50">
                                  até {opt.deliveryDays} {opt.deliveryDays === 1 ? 'dia útil' : 'dias úteis'}
                                </span>
                              )}
                            </span>
                          </span>
                          <span className="font-display text-lg text-plum">{brl(opt.price)}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                )}
              </div>

              {/* ── Dados de entrega — pra quê e pra onde enviar ── */}
              <div className="border-t border-plum/10 py-5">
                <span className="label mb-3 flex items-center gap-2 text-plum/60">
                  <User className="h-4 w-4" />
                  Dados de entrega
                </span>

                <div className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Nome completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={inputClass}
                    aria-label="Nome completo"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="WhatsApp com DDD"
                    maxLength={16}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={inputClass}
                    aria-label="WhatsApp com DDD"
                  />
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      autoComplete="address-line1"
                      placeholder="Rua"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className={`${inputClass} flex-[3]`}
                      aria-label="Rua"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="Nº"
                      value={streetNumber}
                      onChange={(e) => setStreetNumber(e.target.value)}
                      className={`${inputClass} flex-1`}
                      aria-label="Número"
                    />
                  </div>
                  <input
                    type="text"
                    autoComplete="address-line2"
                    placeholder="Complemento (opcional)"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className={inputClass}
                    aria-label="Complemento"
                  />
                  <input
                    type="text"
                    autoComplete="address-level3"
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className={inputClass}
                    aria-label="Bairro"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-plum/10 px-6 py-6">
              <div className="mb-4 flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between text-[13.5px] text-plum-ink/60">
                  <span>Subtotal</span>
                  <span>{brl(subtotal)}</span>
                </div>
                <div className="flex items-baseline justify-between text-[13.5px] text-plum-ink/60">
                  <span>Frete</span>
                  <span>{selectedShipping ? brl(shipping) : 'selecione o frete'}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between border-t border-plum/10 pt-2.5">
                  <span className="label text-plum/50">Total</span>
                  <span className="font-display text-3xl text-plum">{brl(total)}</span>
                </div>
              </div>

              <p className="mb-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-plum-ink/50">
                <Clock className="mt-0.5 h-3.5 w-3.5 flex-none text-plum-ink/35" />
                Sua vela é feita à mão sob encomenda — a confecção leva até 3 dias
                úteis antes do envio.
              </p>

              <p className="mb-4 text-[12.5px] leading-relaxed text-plum-ink/50">
                Pagamento processado com segurança pelo Mercado Pago, em Pix,
                cartão ou boleto.
              </p>

              {checkoutError && (
                <p className="mb-4 rounded-sm bg-red-500/10 px-3 py-2.5 text-[13px] leading-relaxed text-red-700">
                  {checkoutError}
                </p>
              )}

              <button
                type="button"
                onClick={startCheckout}
                disabled={!canCheckout}
                className="btn btn-plum w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkingOut ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Preparando pagamento…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Finalizar compra
                  </>
                )}
              </button>
              {!canCheckout && !checkingOut && (
                <p className="mt-2.5 text-center text-[12px] text-plum-ink/45">
                  {!selectedShipping
                    ? 'Calcule e escolha o frete para continuar.'
                    : 'Preencha seus dados de entrega para continuar.'}
                </p>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
