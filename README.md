# LUMINESCENT — Velas aromáticas artesanais

Loja em **React + Vite + Tailwind**, com checkout completo e funcionando
de ponta a ponta: **Mercado Pago Checkout Pro** para pagamento (Pix,
cartão, boleto) e **Melhor Envio** para frete real por CEP, direto no
carrinho.

## Rodar o front

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

`npm run dev` sobe só o Vite — as funções em `/api` **não** rodam nesse
modo (calcular frete e finalizar compra vão dar 404). Para testar tudo de
verdade, use a CLI da Vercel:

```bash
npm install -g vercel   # uma vez só
vercel link             # a primeira vez, pra conectar esta pasta ao projeto na Vercel
vercel env pull .env.local   # baixa as variáveis já configuradas na Vercel
vercel dev              # sobe front + /api juntos, na porta 3000
```

`vercel env pull` é o caminho mais seguro: baixa exatamente o que já está
configurado na Vercel (Production/Preview/Development) para o
`.env.local`, sem precisar copiar valores manualmente. Se preferir
preencher à mão, use `.env.example` como referência — os nomes lá são
exatamente os que o código lê.

## Variáveis de ambiente

Já configuradas na Vercel (Production, Preview e Development):

| Variável | Usada em | Observação |
|---|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | `api/checkout.js`, `api/webhook.js` | Access Token — de produção pra vender de verdade, de teste (`TEST-...`) pra simular pagamento sem dinheiro real (ver guia de testes) |
| `MELHORENVIO_TOKEN` | `api/frete.js` | Token pessoal de acesso, escopo `shipping-calculate` |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | *(nenhum arquivo, hoje)* | Ver nota abaixo |

**Sobre a `VITE_MERCADOPAGO_PUBLIC_KEY`:** o código não lê essa variável
em lugar nenhum hoje. O checkout atual é 100% redirecionamento (Checkout
Pro clássico): o cliente sai do site e paga numa página hospedada pelo
próprio Mercado Pago, então nenhum SDK deles roda no navegador e nenhuma
chave pública é necessária. Ela fica reservada, sem uso, caso decidam no
futuro trocar para um checkout embutido (Payment Brick) — aí sim ela
entraria no front-end. Não precisa remover da Vercel; só não faz nada por
enquanto.

Duas variáveis opcionais, com valor padrão se você não definir nada:

| Variável | Padrão se ausente |
|---|---|
| `MELHORENVIO_SANDBOX` | `false` (usa a API de produção do Melhor Envio) |
| `MELHORENVIO_USER_AGENT` | um texto genérico — troque por um contato de verdade se o Melhor Envio passar a exigir |

## Regras de empacotamento do frete

Confirmadas com a Naara e implementadas em `api/frete.js` (constantes no
topo do arquivo, se algo mudar):

| | |
|---|---|
| CEP de origem | `03679-050` |
| Peso | 550g fixos por vela, não importa o aroma |
| Comprimento × largura | 17,5 × 11,5 cm — fixos, não escalam |
| Altura | 9 cm por vela empilhada (1 vela = 9cm, 2 = 18cm, 3 = 27cm...) |

O pedido inteiro vira **uma caixa só**: comprimento e largura sempre
iguais, altura e peso crescendo com a quantidade **total** de velas na
sacola (soma entre produtos diferentes, não por linha).

## Deploy na Vercel

1. Import do repositório → a Vercel detecta o Vite sozinho (Framework
   **Vite**, build `npm run build`, output `dist`) e também detecta a
   pasta `/api` como serverless functions automaticamente — nenhuma
   configuração extra é necessária.
2. As variáveis de ambiente já estão configuradas (ver tabela acima).
3. Redeploy sempre que mudar alguma variável — a Vercel não aplica
   variável nova em uma function já publicada sem um novo deploy.

## Estrutura

```
index.html
vite.config.js  tailwind.config.js  postcss.config.js
.env.example              ← nomes exatos das variáveis (sem valores reais)
api/
  _lib.js                 ← helpers HTTP compartilhados (origem, body, CEP)
  checkout.js             ← cria a preferência de pagamento no Mercado Pago
  frete.js                ← cota frete real no Melhor Envio (exporta quoteShipping)
  webhook.js              ← recebe a confirmação de pagamento do Mercado Pago
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
    useCart.js            ← sacola + CEP/frete + startCheckout()
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
| CEP de origem, dimensões da caixa | `api/frete.js`, constantes no topo |

Para adicionar uma vela nova: solte a foto em `public/assets/produtos/`
e acrescente um objeto em `PRODUCTS`. O grid, o modal e a sacola se
atualizam sozinhos.

## Como funciona a compra, do clique ao pagamento

1. **Sacola** (fica salva no navegador, em `localStorage`, entre visitas).
2. **Calcular frete**: a pessoa digita o CEP e clica em "Calcular". O
   front chama `POST /api/frete` com o CEP e os itens (só `id`+`qty`,
   nunca preço). `api/frete.js` monta a caixa (ver regras acima), cota no
   Melhor Envio e devolve as opções disponíveis, ordenadas da mais barata
   pra mais cara.
3. **Escolher o frete**: a pessoa seleciona uma opção da lista. O total
   (subtotal + frete) atualiza na hora. O botão "Finalizar compra" só
   destrava depois que uma opção é escolhida.
4. **Finalizar compra**: o front chama `POST /api/checkout` com os itens,
   o CEP e o **id** da opção de frete escolhida (não o preço). Dentro de
   `checkout.js`:
   - cada produto é reprecificado a partir de `PRODUCTS` no servidor;
   - o frete é **recotado do zero** chamando a mesma função que
     `api/frete.js` usa (`quoteShipping`, exportada de lá) — se o id
     escolhido não aparecer mais na cotação fresca (frete mudou, oferta
     expirou), a compra é recusada com uma mensagem pra recalcular;
   - o preço do frete usado na preferência é sempre o **recém-calculado**,
     nunca o que veio do navegador — isso fecha a mesma brecha de
     segurança que já existia pra preço de produto.
5. A preferência é criada no Mercado Pago com dois tipos de item: os
   produtos e o frete (discriminados separadamente, aparecem assim na
   tela de pagamento). A resposta traz `init_point`; o navegador é
   redirecionado pra lá.
6. Depois de pagar, o Mercado Pago devolve o cliente para
   `/?pedido=aprovado` (ou `pendente` / `recusado`).
7. Em paralelo, o Mercado Pago notifica `/api/webhook`, que busca os
   detalhes reais do pagamento (nunca confia no conteúdo da notificação
   em si, só no que a API deles confirma para aquele id) e registra tudo
   num log estruturado — ver "O que o webhook faz" abaixo.

O WhatsApp continua no site, mas só para contato geral e orçamento de
lembrancinhas personalizadas (`Cta.jsx`, `FloatWpp.jsx`,
`Personalizados.jsx`, rodapé) — não faz parte do fluxo de pagamento.

## O que o webhook faz (e o que ainda não faz)

`api/webhook.js` recebe a notificação, busca o pagamento completo na API
do Mercado Pago e imprime um log assim (visível em Vercel → seu projeto
→ aba **Logs**):

```
[webhook] Pagamento notificado: {"payment_id":123,"status":"approved","status_detail":"accredited","transaction_amount":108.8,"external_reference":"lum_...","destination_cep":"01310930","shipping_service":"PAC","shipping_company":"Correios","payer_email":"...","date_approved":"..."}
```

**Não existe banco de dados ainda** — esse log É a fonte de verdade por
enquanto. Não há e-mail automático pra Naara, nem marcação de "pago" em
lugar nenhum além desse log. Isso é o próximo passo natural (Vercel KV,
Postgres, ou até uma planilha), e o `external_reference` (`lum_...`) já
está pronto pra servir de chave quando isso existir.

## Guia de teste

### 1. Rodar tudo localmente

```bash
vercel dev
```

Abre em `http://localhost:3000` (não `5173` — esse é só o Vite puro,
sem `/api`). Todo o resto deste guia assume que é essa URL que está
aberta no navegador.

### 2. Validar a cotação de frete

1. No site, adicione 1 vela à sacola, digite um CEP de destino e clique
   em Calcular.
2. Abra, num separador à parte, o **painel do Melhor Envio → ícone da
   calculadora** (canto superior direito do painel de controle da conta
   da Naara) e cote manualmente:
   - origem `03679-050`
   - destino: o mesmo CEP que você usou no site
   - dimensões: **17,5 × 11,5 × 9 cm**, peso **0,55 kg** (1 vela)
3. Os preços e prazos exibidos no site devem bater com os da calculadora
   — ambos usam a mesma API e a mesma conta, então a única fonte de
   diferença legítima seria o relógio (tarifas podem mudar de um
   segundo pro outro raramente).
4. Repita com 2 e 3 velas na sacola, ajustando a altura na calculadora
   manual para 18cm e 27cm (peso 1,1kg e 1,65kg) — confirma que a
   escala está de fato ligada à quantidade total, não ao produto.

Se algo não bater, o primeiro lugar a olhar é o log da função
(`vercel dev` mostra no próprio terminal; na Vercel, em **Logs**) — toda
falha do Melhor Envio é registrada como `[frete] Melhor Envio recusou a
cotação: ...` com o corpo da resposta deles.

### 3. Simular pagamento aprovado e recusado (sem dinheiro real)

**Importante:** cartões de teste só funcionam com um **Access Token de
TESTE** (começa com `TEST-`), nunca com o de produção. Se usar o token
de produção com esses números de cartão, o Mercado Pago vai tratar como
uma tentativa real com cartão inválido — não como uma simulação.

1. No painel do Mercado Pago Developers, na aplicação "Loja Luminescent",
   pegue o **Access Token de teste** em "Credenciais de teste".
2. Troque temporariamente `MERCADOPAGO_ACCESS_TOKEN` no `.env.local` por
   esse token de teste, e reinicie o `vercel dev`.
   **Não suba essa troca pra Vercel** — é só para teste local.
3. Monte um pedido no site, calcule o frete, finalize a compra.
4. Na tela do Mercado Pago, preencha o cartão com um dos números de
   teste abaixo (funcionam só em modo teste):

   | Bandeira | Número | CVV | Validade |
   |---|---|---|---|
   | Mastercard | `5031 4332 1540 6351` | `123` | qualquer data futura (ex.: `11/30`) |
   | Visa | `4235 6477 2802 5682` | `123` | qualquer data futura |

5. No campo **nome do titular**, digite um destes códigos — é ele que
   decide o resultado da simulação, não o número do cartão:

   | Nome do titular | Resultado |
   |---|---|
   | `APRO` | Aprovado |
   | `FUND` | Recusado por saldo insuficiente |
   | `SECU` | Recusado por CVV inválido |
   | `EXPI` | Recusado por problema na validade |
   | `OTHE` | Recusado por erro genérico |
   | `CONT` | Fica pendente |

6. CPF: qualquer um de formato válido, ex. `123.456.789-09`.
7. Confira que o site te devolve pra `/?pedido=aprovado` (ou
   `recusado`/`pendente`, conforme o cenário escolhido).

Se a página do Mercado Pago pedir login em vez de mostrar o formulário
de cartão direto, procure na resposta de `/api/checkout` (log da Vercel)
o campo `sandbox_init_point` — algumas contas de teste usam essa URL em
vez da `init_point` normal para o fluxo sem login.

**Pix não pode ser testado com token de teste** — o Mercado Pago não
simula Pix em modo sandbox. Pra validar Pix de verdade, é preciso usar o
token de produção e fazer uma compra real de valor baixo (ex.: uma vela
só) e estornar depois, ou simplesmente confiar no fluxo (é a mesma
preferência, o Mercado Pago escolhe como renderizar o meio de pagamento
na própria página deles — não há código específico de Pix no projeto).

**Não esqueça de voltar o `.env.local` para o token de produção** depois
de testar, ou copiar de novo com `vercel env pull .env.local`.

### 4. Confirmar que o webhook está recebendo notificação

Depois de qualquer pagamento de teste (aprovado, recusado ou pendente),
o Mercado Pago dispara a notificação automaticamente. Pra conferir:

- **Rodando com `vercel dev` localmente:** o terminal onde ele está
  rodando vai imprimir a linha `[webhook] Pagamento notificado: {...}`
  assim que a notificação chegar (pode levar alguns segundos).
  Se `vercel dev` estiver rodando só na sua máquina sem estar exposto na
  internet, o Mercado Pago **não consegue alcançar** `localhost` — nesse
  caso, teste direto num deploy publicado (Preview ou Production) em vez
  de local, ou use uma ferramenta de túnel (ex. `ngrok`) apontando pra
  porta 3000 e configure essa URL temporária como notification_url só
  para esse teste.
- **Testando num deploy publicado:** Vercel → seu projeto → aba **Logs**
  → filtre por `webhook`. A mesma linha deve aparecer lá.
- **Teste de conectividade sem precisar pagar nada:** no painel do
  Mercado Pago → sua aplicação → **Webhooks**, tem um botão de simular
  envio de notificação. Ele manda um `id` fictício — o log vai mostrar
  `[webhook] Pagamento não encontrado (provável simulação)`, o que já
  confirma que a URL está correta e respondendo (200), mesmo sem um
  pagamento de verdade por trás.

### 5. Checklist final antes de liberar pra Naara vender

- [ ] `MERCADOPAGO_ACCESS_TOKEN` na Vercel é o de **produção**, não o de
      teste usado no passo 3 (conferir em Project Settings →
      Environment Variables → Production)
- [ ] Fez pelo menos uma compra de teste completa (produto + frete real
      + pagamento aprovado) num ambiente publicado, não só local
- [ ] Confirmou o log do webhook para essa compra de teste
- [ ] Cotação de frete validada contra a calculadora do Melhor Envio
      (passo 2) para pelo menos 1, 2 e 3 velas
- [ ] Testou pelo menos um cenário de frete indisponível (CEP muito
      remoto ou inválido) e confirmou que a mensagem de erro aparece
      de forma clara no carrinho, sem travar a página
- [ ] Testou finalizar a compra sem ter calculado o frete antes — o
      botão deve estar bloqueado
- [ ] Revisou `PRODUCTS` em `src/data/store.js`: preços, pesos e fotos
      batendo com o estoque real
- [ ] Confirmou o CEP de origem e as dimensões da caixa em
      `api/frete.js` uma última vez com a Naara
- [ ] Testou em pelo menos um celular de verdade (não só emulador) —
      teclado numérico abrindo certo no campo de CEP, sacola abrindo e
      fechando bem, sem travar durante o redirecionamento pro Mercado Pago

## Paleta

Extraída do logo:

- Roxo profundo `#4A0E7A` · marinho `#2C094A` · tinta `#1A0530`
- Orquídea `#A855D8` · clara `#D070ED` · brilho `#C77DFF`
- Lilás `#E6C7F5` · névoa `#F7EDF9`
- Creme `#FAEBE2`

Tipografia: **Cormorant Garamond** (display) + **Jost** (texto e rótulos).

---
Nova AI Solutions
