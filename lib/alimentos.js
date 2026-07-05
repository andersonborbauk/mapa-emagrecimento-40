// Biblioteca de alimentos do Mapa do Emagrecimento 40+
// Cada item tem: id, nome, categoria, porcaoBaseG (gramatura padrão pronta),
// porcaoBaseColher (equivalência em colher, texto), fatorConversaoCompra (só proteína),
// adequadoCeia (bool)

export const PROTEINAS = [
  { id: 'frango', nome: 'Peito de frango grelhado', porcaoBaseG: 100, porcaoBaseColher: null, fatorConversaoCompra: 1.35, adequadoCeia: false },
  { id: 'carne_bovina', nome: 'Carne bovina grelhada', porcaoBaseG: 100, porcaoBaseColher: null, fatorConversaoCompra: 1.40, adequadoCeia: false },
  { id: 'carne_moida', nome: 'Carne moída refogada', porcaoBaseG: 100, porcaoBaseColher: null, fatorConversaoCompra: 1.40, adequadoCeia: false },
  { id: 'peixe', nome: 'Peixe grelhado/assado', porcaoBaseG: 100, porcaoBaseColher: null, fatorConversaoCompra: 1.20, adequadoCeia: false },
  { id: 'ovo', nome: 'Ovo', porcaoBaseG: null, porcaoBaseUnidade: 2, fatorConversaoCompra: null, adequadoCeia: true },
  { id: 'queijo_branco', nome: 'Queijo branco', porcaoBaseG: 50, porcaoBaseColher: null, fatorConversaoCompra: null, adequadoCeia: true },
  { id: 'queijo_cottage', nome: 'Queijo cottage', porcaoBaseG: 50, porcaoBaseColher: null, fatorConversaoCompra: null, adequadoCeia: true },
  { id: 'iogurte_natural', nome: 'Iogurte natural (sem açúcar)', porcaoBaseG: 100, porcaoBaseColher: null, fatorConversaoCompra: null, adequadoCeia: true },
];

// Carboidrato do almoço — slot único, grão OU tubérculo, escolha semanal da cliente
export const CARBOIDRATOS_ALMOCO = [
  { id: 'arroz_integral', nome: 'Arroz integral', tipo: 'grao', porcaoBaseG: 100, porcaoBaseColher: '3 colheres de sopa' },
  { id: 'feijao_carioca', nome: 'Feijão carioca', tipo: 'grao', porcaoBaseG: 100, porcaoBaseColher: '1 concha média' },
  { id: 'feijao_preto', nome: 'Feijão preto', tipo: 'grao', porcaoBaseG: 100, porcaoBaseColher: '1 concha média' },
  { id: 'lentilha', nome: 'Lentilha', tipo: 'grao', porcaoBaseG: 100, porcaoBaseColher: '1 concha média' },
  { id: 'grao_de_bico', nome: 'Grão-de-bico', tipo: 'grao', porcaoBaseG: 100, porcaoBaseColher: '1 concha média' },
  { id: 'quinoa', nome: 'Quinoa', tipo: 'grao', porcaoBaseG: 100, porcaoBaseColher: '3 colheres de sopa' },
  { id: 'ervilha', nome: 'Ervilha', tipo: 'grao', porcaoBaseG: 80, porcaoBaseColher: '2 colheres de sopa' },
  { id: 'batata_inglesa', nome: 'Batata inglesa', tipo: 'tuberculo', porcaoBaseG: 100, porcaoBaseColher: '1 unidade média' },
  { id: 'batata_doce', nome: 'Batata-doce', tipo: 'tuberculo', porcaoBaseG: 100, porcaoBaseColher: '1 unidade média' },
  { id: 'mandioca', nome: 'Mandioca/aipim', tipo: 'tuberculo', porcaoBaseG: 100, porcaoBaseColher: '2 pedaços médios' },
  { id: 'milho', nome: 'Milho', tipo: 'tuberculo', porcaoBaseG: 80, porcaoBaseColher: '2 colheres de sopa' },
];

// Legumes de baixa caloria/carboidrato — liberados à vontade, sem gramatura
export const LEGUMES_LIBERADOS = [
  'Brócolis', 'Couve-flor', 'Abobrinha', 'Pepino', 'Berinjela', 'Vagem',
  'Chuchu', 'Aspargo', 'Cogumelo', 'Repolho', 'Rabanete', 'Tomate',
  'Pimentão', 'Quiabo', 'Jiló', 'Cenoura', 'Beterraba',
];

// Saladas de folha — sempre à vontade
export const SALADAS_FOLHA = [
  'Alface', 'Rúcula', 'Agrião', 'Espinafre', 'Couve crua', 'Chicória',
];

// Frutas leves pra café da manhã e ceia
export const FRUTAS_LEVES = [
  { id: 'morango', nome: 'Morango', adequadoCeia: true },
  { id: 'abacaxi', nome: 'Abacaxi (fatias)', adequadoCeia: false },
  { id: 'kiwi', nome: 'Kiwi', adequadoCeia: true },
];

// Itens leves pra ceia, além da proteína
export const CEIA_EXTRAS = ['Castanhas (punhado)'];

export function listarCarboidratosPorTipo(tipo) {
  return CARBOIDRATOS_ALMOCO.filter((item) => item.tipo === tipo);
}
