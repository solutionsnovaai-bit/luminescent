# LUMINESCENT — Velas aromáticas artesanais

Loja em **React + Vite + Tailwind**. Front completo, com sacola funcional
e fechamento de pedido pelo WhatsApp. Pronta para receber a Shopify depois,
sem reescrever componente nenhum.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## Deploy na Vercel

Import do repositório → a Vercel detecta o Vite sozinho.
Framework **Vite**, build `npm run build`, output `dist`.

## Estrutura

```
index.html
vite.config.js  tailwind.config.js  postcss.config.js
public/
  assets/
    hero-desktop.jpg      ← logo sangrando à direita (desktop)
    hero-mobile.jpg       ← versão vertical (reserva)
    faixa-clara.jpg       ← fundo lilás da seção "Quem faz"
    logo.png              ← logo em PNG transparente
    produtos/*.jpg        ← as 5 velas + a personalizada
src/
  main.jsx
  App.jsx
  index.css               ← tokens da marca e classes base
  data/store.js           ← ÚNICA fonte de dados: produtos, preço, contatos, FAQ
  hooks/
    useCart.js            ← sacola (persiste no navegador)
    useReveal.js          ← animação de entrada no scroll
  components/
    Loader, Nav, Hero, Marquee, SectionHead,
    Products, ProductCard, ProductModal, CartDrawer,
    Personalizados, Sobre, Cuidados, Faq, Cta, Footer, FloatWpp, Icons
```

## Onde mexer

| O quê | Onde |
|---|---|
| Preço, produtos, aromas, pesos | `src/data/store.js` → `PRODUCTS` e `PRICE` |
| WhatsApp e Instagram | `src/data/store.js` → `BRAND` |
| Perguntas frequentes | `src/data/store.js` → `FAQ` |
| Cuidados com a vela | `src/data/store.js` → `CARE` |
| Cores e fontes | `tailwind.config.js` |

Para adicionar uma vela nova: solte a foto em `public/assets/produtos/`
e acrescente um objeto em `PRODUCTS`. O grid, o modal e a sacola se
atualizam sozinhos.

## Como funciona a venda hoje

A sacola é local (fica salva no navegador do cliente). Ao finalizar, o site
monta a mensagem já formatada com itens, quantidades e total, e abre o
WhatsApp da Naara. Frete e pagamento são combinados na conversa.

## Quando a Shopify entrar

Trocar apenas `src/data/store.js`: no lugar do array estático, buscar os
produtos pela Storefront API mantendo o mesmo formato de objeto
(`id, name, weight, price, image, notes, description`). Em seguida, apontar
o botão de finalizar para o checkout da Shopify em vez do link do WhatsApp.
Nenhum componente precisa mudar.

## Paleta

Extraída do logo:

- Roxo profundo `#4A0E7A` · marinho `#2C094A` · tinta `#1A0530`
- Orquídea `#A855D8` · clara `#D070ED` · brilho `#C77DFF`
- Lilás `#E6C7F5` · névoa `#F7EDF9`
- Creme `#FAEBE2`

Tipografia: **Cormorant Garamond** (display) + **Jost** (texto e rótulos).

---
Nova AI Solutions
