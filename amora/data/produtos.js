/* =========================================================
   CATÁLOGO DE PRODUTOS
   - Os itens abaixo são EXEMPLOS: troque pelos produtos reais.
   - "imagens": caminhos em assets/img/produtos/ (ex.: "assets/img/produtos/vestido-midi-1.jpg").
     Sem imagem, o site mostra um fundo provisório.
   - "precoDe": preço antigo (opcional) para mostrar promoção.
   - "estoque": deixe false para marcar como esgotado.
   ========================================================= */
window.CATEGORIAS = [
  { id: "vestidos", nome: "Vestidos" },
  { id: "jeans", nome: "Jeans" },
  { id: "calcas", nome: "Calças" },
  { id: "blusas", nome: "Blusas" },
  { id: "camisas", nome: "Camisas" },
  { id: "saias", nome: "Saias" },
  { id: "shorts", nome: "Shorts" }
];

window.PRODUTOS = [
  {
    id: "vestido-midi-amora",
    nome: "Vestido Midi Amora",
    categoria: "vestidos",
    preco: 229.9,
    precoDe: 269.9,
    tamanhos: ["P", "M", "G"],
    cores: ["Vinho", "Preto"],
    descricao: "Vestido midi de malha canelada com caimento fluido e decote quadrado. Uma peça que vai do trabalho ao jantar.",
    imagens: [],
    destaque: true,
    novo: true,
    estoque: true
  },
  {
    id: "calca-jeans-wide-leg",
    nome: "Calça Jeans Wide Leg",
    categoria: "jeans",
    preco: 249.9,
    tamanhos: ["36", "38", "40", "42", "44"],
    cores: ["Azul médio"],
    descricao: "Modelagem wide leg de cintura alta que alonga a silhueta. Jeans com elastano para mais conforto.",
    imagens: [],
    destaque: true,
    estoque: true
  },
  {
    id: "camisa-linho-off",
    nome: "Camisa de Linho Off White",
    categoria: "camisas",
    preco: 189.9,
    tamanhos: ["P", "M", "G", "GG"],
    cores: ["Off white", "Areia"],
    descricao: "Camisa leve de linho com mangas longas dobráveis. Fresca para o calor e elegante em qualquer composição.",
    imagens: [],
    destaque: true,
    novo: true,
    estoque: true
  },
  {
    id: "blusa-tricot-ombro",
    nome: "Blusa Tricô Ombro a Ombro",
    categoria: "blusas",
    preco: 139.9,
    tamanhos: ["Único"],
    cores: ["Rosê", "Creme"],
    descricao: "Tricô macio com decote ombro a ombro. Combina com jeans, saia ou alfaiataria.",
    imagens: [],
    destaque: true,
    estoque: true
  },
  {
    id: "calca-alfaiataria-pantalona",
    nome: "Calça Pantalona Alfaiataria",
    categoria: "calcas",
    preco: 219.9,
    tamanhos: ["P", "M", "G"],
    cores: ["Preto", "Caramelo"],
    descricao: "Pantalona de alfaiataria com pregas frontais e cós alto. Básico sofisticado do guarda-roupa.",
    imagens: [],
    estoque: true
  },
  {
    id: "saia-midi-plissada",
    nome: "Saia Midi Plissada",
    categoria: "saias",
    preco: 179.9,
    precoDe: 199.9,
    tamanhos: ["P", "M", "G"],
    cores: ["Verde oliva", "Preto"],
    descricao: "Saia plissada com movimento e cintura elástica. Feminina e fácil de usar.",
    imagens: [],
    estoque: true
  },
  {
    id: "short-jeans-cintura-alta",
    nome: "Short Jeans Cintura Alta",
    categoria: "shorts",
    preco: 149.9,
    tamanhos: ["36", "38", "40", "42"],
    cores: ["Azul claro"],
    descricao: "Short jeans de cintura alta com barra desfiada. Perfeito para os dias quentes.",
    imagens: [],
    estoque: true
  },
  {
    id: "vestido-longo-floral",
    nome: "Vestido Longo Floral",
    categoria: "vestidos",
    preco: 259.9,
    tamanhos: ["P", "M", "G"],
    cores: ["Estampado"],
    descricao: "Vestido longo em viscose estampada com amarração na cintura e fenda lateral.",
    imagens: [],
    novo: true,
    estoque: false
  }
];
