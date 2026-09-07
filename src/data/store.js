/**
 * Fonte única de dados da loja.
 *
 * Quando a Shopify entrar, é este arquivo que muda: basta trocar o array
 * estático por uma chamada à Storefront API mantendo o mesmo formato de
 * objeto, e nenhum componente precisa ser alterado.
 *
 * Pesos: lidos direto da etiqueta nas fotos reais que a Naara mandou
 * (não são mais estimativa por faixa de preço). Orquídea Negra, Espresso
 * e os itens da Coleção de Natal sem número visível na etiqueta ainda
 * estão marcados como pendentes de confirmação — ver comentário em cada
 * um deles.
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

export const brl = (n) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const waLink = (text) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

/**
 * Catálogo vendável online (entra no carrinho, no frete e no checkout).
 * Preço e peso variam por vela — não existe mais um preço único.
 */
export const PRODUCTS = [
  // ── Linha aromática ──
  {
    id: 'baunilha',
    name: 'Baunilha',
    tagline: 'Doce e envolvente',
    weight: '150g',
    price: 59.9,
    image: '/assets/produtos/baunilha.jpg',
    notes: ['Baunilha', 'Leite', 'Fava tonka'],
    description:
      'Doce sem enjoar, do tipo que lembra sobremesa recém-feita. Uma das primeiras que a Naara fez, e ainda uma das mais pedidas.',
  },
  {
    id: 'jasmim',
    name: 'Jasmim',
    tagline: 'Floral suave',
    weight: '180g',
    price: 59.9,
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
    price: 59.9,
    image: '/assets/produtos/cha-branco.jpg',
    notes: ['Chá branco', 'Camélia', 'Cítrico leve'],
    description:
      'Fresco, sereno e quase transparente. É a vela de começar o dia — funciona muito bem em home office e banheiro.',
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    tagline: 'Verde e limpo',
    weight: '150g',
    price: 59.9,
    image: '/assets/produtos/bamboo.jpg',
    notes: ['Bambu', 'Folhas verdes', 'Almíscar branco'],
    description:
      'Um verde fresco, quase aquático — lembra casa arejada e roupa limpa. A opção certa pra quem não curte aroma doce.',
  },
  {
    id: 'canela',
    name: 'Canela',
    tagline: 'Quente e especiado',
    weight: '150g',
    price: 59.9,
    image: '/assets/produtos/canela.jpg',
    notes: ['Canela', 'Cravo', 'Laranja'],
    description:
      'Especiaria de verdade, sem ficar enjoativa. Combina com tarde fria e aquela casa com cheiro de comida no forno.',
  },
  {
    id: 'lavanda',
    name: 'Lavanda',
    tagline: 'Calma em forma de vela',
    weight: '100g',
    price: 50,
    image: '/assets/produtos/lavanda.jpg',
    notes: ['Lavanda', 'Erva-doce', 'Almíscar'],
    description:
      'A clássica vela de relaxar. Queima devagar ao lado da cama, na hora de desacelerar o dia.',
  },
  {
    id: 'baunilha-caramelo',
    name: 'Baunilha & Caramelo',
    tagline: 'Duas doçuras, uma vela',
    weight: '150g',
    price: 66,
    image: '/assets/produtos/baunilha-caramelo.jpg',
    notes: ['Baunilha', 'Caramelo', 'Manteiga'],
    description:
      'Baunilha com um toque de caramelo queimado — mais encorpada que a Baunilha sozinha, quase uma sobremesa em forma de aroma.',
  },

  // ── Coleção Das Estações ──
  {
    id: 'frio-que-aquece',
    name: 'Frio que Aquece',
    tagline: 'Coleção Estações · Inverno',
    weight: '240g',
    price: 79.9,
    image: '/assets/produtos/frio-que-aquece.jpg',
    notes: ['Âmbar', 'Baunilha', 'Madeira'],
    description:
      'Da Coleção Estações: pensada pros dias mais frios do ano, com um fundo quente que contrasta com o nome. Acende bem embaixo do cobertor.',
    collection: 'Estações',
  },
  {
    id: 'brisa-de-primavera',
    name: 'Brisa de Primavera',
    tagline: 'Coleção Estações · Primavera',
    weight: '240g',
    price: 79.9,
    image: '/assets/produtos/brisa-de-primavera.jpg',
    notes: ['Flores brancas', 'Verde', 'Cítrico'],
    description:
      'Da Coleção Estações: um floral leve e renovado, do tipo que lembra janela aberta numa manhã de primavera.',
    collection: 'Estações',
  },
  {
    id: 'ouro-solar',
    name: 'Ouro Solar',
    tagline: 'Coleção Estações · Verão',
    weight: '240g',
    price: 79.9,
    image: '/assets/produtos/ouro-solar.jpg',
    notes: ['Coco', 'Baunilha', 'Flor de laranjeira'],
    description:
      'Da Coleção Estações: o verão em forma de vela — tropical, solar, um pouco adocicado. Combina com fim de tarde de varanda.',
    collection: 'Estações',
  },
  {
    id: 'outono',
    name: 'Outono',
    tagline: 'Coleção Estações · Outono',
    weight: '240g', // inferido pelo padrão dos outros 3 da coleção — confirmar com etiqueta real
    price: 79.9,
    image: '/assets/produtos/outono.jpg',
    notes: ['Especiarias', 'Âmbar', 'Madeira seca'],
    description:
      'Da Coleção Estações: a que traz especiaria, madeira e aquele calor de dia curto. Vem em pote de vidro com tampa de madeira.',
    collection: 'Estações',
  },

  // ── Clássicas (fora das coleções temáticas) ──
  {
    id: 'orquidea-negra',
    name: 'Orquídea Negra',
    tagline: 'Floral intenso',
    weight: '550g', // NÃO CONFIRMADO — sem etiqueta real ainda, ver aviso no chat
    price: 79.9,
    image: '/assets/produtos/orquidea-negra.jpg',
    notes: ['Orquídea', 'Baunilha', 'Âmbar'],
    description:
      'O oposto do floral leve: encorpado, adocicado e um pouco misterioso. Feita para sala à noite e jantar demorado.',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    tagline: 'Café torrado',
    weight: '550g', // NÃO CONFIRMADO — sem etiqueta real ainda, ver aviso no chat
    price: 79.9,
    image: '/assets/produtos/espresso.jpg',
    notes: ['Café torrado', 'Cacau', 'Creme'],
    description:
      'Café recém-passado, com detalhe de grãos em cera na superfície. A preferida de quem trabalha em casa e de quem ama cozinha.',
  },

  // ── Coleção de Natal ──
  {
    id: 'natalina-80g',
    name: 'Velas Natalina 80g',
    tagline: 'Edição de Natal · unidade',
    weight: '80g',
    price: 42,
    image: '/assets/produtos/natalina-80g.jpg',
    notes: ['Especiarias natalinas', 'Pinho', 'Canela'],
    description:
      'Miniatura pra clima de Natal — perfeita pra decorar a mesa ou dar de lembrancinha. O desenho da tampa pode variar entre os disponíveis; se quiser escolher um específico, é só falar no WhatsApp depois do pedido.',
    collection: 'Natal',
  },
  {
    id: 'natalina-aromatica',
    name: 'Vela Aromática Natalina',
    tagline: 'Edição de Natal',
    weight: '240g', // estimado pelo formato do pote — sem grama visível na etiqueta
    price: 50,
    image: '/assets/produtos/natalina-aromatica.jpg',
    notes: ['Pinho', 'Canela', 'Laranja'],
    description:
      'A vela de Natal em tamanho cheio, com tampa dourada e etiqueta em relevo — a mais bonita pra deixar em cima da mesa na ceia.',
    collection: 'Natal',
  },
  {
    id: 'feliz-natal-vermelha',
    name: 'Feliz Natal — Vermelha',
    tagline: 'Edição de Natal · laço vermelho',
    weight: '240g', // estimado pelo formato do pote — sem grama visível na etiqueta
    price: 80,
    image: '/assets/produtos/feliz-natal-1.jpg',
    notes: ['Especiarias', 'Frutas vermelhas', 'Baunilha'],
    description:
      'Vem com laço decorativo já amarrado, pronta pra presentear sem embrulho extra. Esta é a versão de laço vermelho.',
    collection: 'Natal',
  },
  {
    id: 'feliz-natal-verde',
    name: 'Feliz Natal — Verde',
    tagline: 'Edição de Natal · laço verde',
    weight: '240g', // estimado pelo formato do pote — sem grama visível na etiqueta
    price: 80,
    image: '/assets/produtos/feliz-natal-2.jpg',
    notes: ['Especiarias', 'Pinho', 'Baunilha'],
    description:
      'Vem com laço decorativo já amarrado, pronta pra presentear sem embrulho extra. Esta é a versão de laço verde.',
    collection: 'Natal',
  },
  {
    id: 'feliz-natal-dourada',
    name: 'Feliz Natal — Dourada',
    tagline: 'Edição de Natal · laço dourado',
    weight: '240g', // estimado pelo formato do pote — sem grama visível na etiqueta
    price: 80,
    image: '/assets/produtos/feliz-natal-3.jpg',
    notes: ['Especiarias', 'Âmbar', 'Baunilha'],
    description:
      'Vem com laço decorativo já amarrado, pronta pra presentear sem embrulho extra. Esta é a versão de laço dourado.',
    collection: 'Natal',
  },
];

/**
 * Kits e presentes — NÃO entram no carrinho nem no cálculo de frete.
 * O formato deles (bandeja, chocolate, moldes) não empilha como pote de
 * vela, então o orçamento e o envio são combinados direto no WhatsApp.
 */
export const KITS = [
  {
    id: 'vela-lidia',
    name: 'Vela Lídia',
    price: 89,
    image: '/assets/produtos/vela-lidia.jpg',
    description: 'Kit com vela aromática em molde de rosa e bandeja decorativa para presente.',
  },
  {
    id: 'vela-sonia',
    name: 'Vela Sônia',
    price: 89,
    image: '/assets/produtos/vela-sonia.jpg',
    description: 'Kit com vela aromática em molde de rosa e bandeja, na paleta rosa/vermelho.',
  },
  {
    id: 'kit-coelho-cacau',
    name: 'Kit Coelho e Cacau',
    price: 40,
    image: '/assets/produtos/kit-coelho-cacau.jpg',
    description: 'Uma barra de chocolate e a mini vela em formato de coelho, juntas num presente fofo.',
  },
  {
    id: 'coelho-luminescent',
    name: 'Coelho Luminescent',
    price: 18,
    image: '/assets/produtos/coelho-luminescent.jpg',
    description: 'Só a mini vela em formato de coelho — um presente pequeno e delicado.',
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
    a: 'Depende do tamanho e de como você acende. Em média, uma vela de 150g rende entre 20 e 25 horas de queima. Acendimentos mais longos, de 2 a 3 horas, aproveitam melhor a cera.',
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
    q: 'E os kits e presentes prontos, como a Vela Lídia ou o Coelho Luminescent?',
    a: 'Esses fogem do formato de pote simples (têm bandeja, molde ou chocolate junto), então o orçamento e o frete deles são combinados direto no WhatsApp, fora do carrinho do site.',
  },
  {
    q: 'Como faço meu pedido?',
    a: 'Monte sua sacola aqui no site e finalize o pagamento direto por aqui, com segurança do Mercado Pago — Pix, cartão ou boleto. Assim que o pagamento é aprovado, o pedido segue para envio.',
  },
  {
    q: 'Vocês enviam para todo o Brasil?',
    a: 'Sim, enviamos para todo o país pelos Correios e transportadoras parceiras. O frete é calculado automaticamente pelo seu CEP direto no carrinho, com preço e prazo reais antes de você finalizar a compra.',
  },
];
