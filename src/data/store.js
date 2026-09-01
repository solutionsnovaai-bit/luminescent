/**
 * Fonte única de dados da loja.
 *
 * Quando a Shopify entrar, é este arquivo que muda: basta trocar o array
 * estático por uma chamada à Storefront API mantendo o mesmo formato de
 * objeto, e nenhum componente precisa ser alterado.
 */

export const BRAND = {
  name: 'LUMINESCENT',
  by: 'BY NAARA CARREIRA',
  instagram: 'luminescentofc',
  instagramUrl: 'https://instagram.com/luminescentofc',
  instagramNaara: 'https://instagram.com/naaracarreira',
  whatsapp: '5511982228320',
  whatsappLabel: '(11) 98222-8320',
};

export const PRICE = 79.9;

export const brl = (n) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const waLink = (text) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

export const PRODUCTS = [
  {
    id: 'jasmim',
    name: 'Jasmim',
    tagline: 'Floral suave',
    weight: '180g',
    price: PRICE,
    image: '/assets/produtos/jasmim.jpg',
    notes: ['Jasmim', 'Floral branco', 'Fundo amadeirado'],
    description:
      'Um floral limpo e discreto, daqueles que ocupam o ambiente sem pesar. Acende bem no fim da tarde e combina com quarto e leitura.',
  },
  {
    id: 'cha-branco',
    name: 'Chá Branco',
    tagline: 'Fresco e sereno',
    weight: '150g',
    price: PRICE,
    image: '/assets/produtos/cha-branco.jpg',
    notes: ['Chá branco', 'Camélia', 'Cítrico leve'],
    description:
      'Fresco, sereno e quase transparente. É a vela de começar o dia — funciona muito bem em home office e banheiro.',
  },
  {
    id: 'orquidea-negra',
    name: 'Orquídea Negra',
    tagline: 'Floral intenso',
    weight: '150g',
    price: PRICE,
    image: '/assets/produtos/orquidea-negra.jpg',
    notes: ['Orquídea', 'Baunilha', 'Âmbar'],
    description:
      'O oposto do floral leve: encorpado, adocicado e um pouco misterioso. Feita para sala à noite e jantar demorado.',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    tagline: 'Café torrado',
    weight: '190g',
    price: PRICE,
    image: '/assets/produtos/espresso.jpg',
    notes: ['Café torrado', 'Cacau', 'Creme'],
    description:
      'Café recém-passado, com detalhe de grãos em cera na superfície. A preferida de quem trabalha em casa e de quem ama cozinha.',
  },
  {
    id: 'outono',
    name: 'Outono',
    tagline: 'Coleção Estações',
    weight: '190g',
    price: PRICE,
    image: '/assets/produtos/outono.jpg',
    notes: ['Especiarias', 'Âmbar', 'Madeira seca'],
    description:
      'Da Coleção Estações: a que traz especiaria, madeira e aquele calor de dia curto. Vem em pote de vidro com tampa de madeira.',
    collection: 'Estações',
  },
];

export const CARE = [
  { n: '01', title: 'Escolha um local seguro', text: 'Superfície resistente ao calor e longe de itens inflamáveis.' },
  { n: '02', title: 'Mantenha a vela à vista', text: 'Nunca deixe acesa sem supervisão, principalmente perto de crianças e pets.' },
  { n: '03', title: 'Corte o pavio', text: 'Deixe o pavio com cerca de 0,5 cm antes de cada acendimento.' },
  { n: '04', title: 'Evite correntes de ar', text: 'Vento faz a chama oscilar, gasta a cera mais rápido e solta fuligem.' },
];

export const FAQ = [
  {
    q: 'As velas são veganas?',
    a: 'Sim. Todas são 100% veganas e artesanais, feitas à mão em pequenos lotes — sem ingredientes de origem animal e sem teste em animais.',
  },
  {
    q: 'Quanto tempo dura cada vela?',
    a: 'Depende do tamanho e de como você acende. Em média, uma vela de 150g rende entre 25 e 30 horas de queima. Acendimentos mais longos, de 2 a 3 horas, aproveitam melhor a cera.',
  },
  {
    q: 'Por que a primeira queima é importante?',
    a: 'Na primeira vez, deixe acesa até a cera derreter em toda a superfície, encostando na borda do pote. Isso evita que a vela crie um túnel no centro e desperdice cera nas laterais.',
  },
  {
    q: 'Vocês fazem lembrancinhas personalizadas?',
    a: 'Fazemos. Casamento, aniversário, chá de bebê, evento corporativo — com rótulo, aroma e embalagem escolhidos por você. O orçamento é feito pelo WhatsApp, conforme a quantidade.',
  },
  {
    q: 'Como faço meu pedido?',
    a: 'Monte sua sacola aqui no site e finalize pelo WhatsApp: a mensagem já vai pronta com os itens e o total. A partir daí combinamos pagamento e envio.',
  },
  {
    q: 'Vocês enviam para todo o Brasil?',
    a: 'Sim, enviamos para todo o país. O frete é calculado pelo CEP na hora do pedido, e para São Paulo há também a opção de entrega combinada.',
  },
];
