import { PROTEINAS, CARBOIDRATOS_ALMOCO } from './alimentos';

const MARGEM_SEGURANCA_PROTEINA = 1.10; // 10% de margem pra não faltar no meio da semana

/**
 * Recebe o plano semanal (array de 7 dias) e devolve a lista de compras agregada,
 * já convertendo proteína de peso pronto pra peso cru + margem de segurança.
 * Grãos/tubérculos aparecem por "pacote/unidade aproximada", sem gramatura.
 */
export function gerarListaDeCompras(planoSemanal) {
  const totaisProteinaPorId = {}; // id -> soma de gramas prontos na semana
  const idsCarboidratoUsados = new Set();
  const legumesUsados = new Set();
  const saladasUsadas = new Set();

  for (const diaPlano of planoSemanal) {
    for (const refeicao of Object.values(diaPlano.refeicoes)) {
      for (const item of refeicao.itens) {
        if (item.tipo === 'proteina' && item.id && item.gramasPronto) {
          totaisProteinaPorId[item.id] = (totaisProteinaPorId[item.id] || 0) + item.gramasPronto;
        }
        if (item.tipo === 'carboidrato' && item.id) {
          idsCarboidratoUsados.add(item.id);
        }
        if (item.tipo === 'legume') legumesUsados.add(item.nome);
        if (item.tipo === 'salada') saladasUsadas.add(item.nome);
      }
    }
  }

  const listaProteinas = Object.entries(totaisProteinaPorId).map(([id, totalGramasPronto]) => {
    const item = PROTEINAS.find((p) => p.id === id);
    if (!item || !item.fatorConversaoCompra) {
      // itens sem fator de conversão (ex: queijo, iogurte) — mostra o peso pronto mesmo, sem conversão
      return { nome: item ? item.nome : id, quantidade: `${Math.round(totalGramasPronto)}g` };
    }
    const cruComMargem = totalGramasPronto * item.fatorConversaoCompra * MARGEM_SEGURANCA_PROTEINA;
    return { nome: item.nome, quantidade: `${Math.round(cruComMargem / 10) * 10}g (cru)` };
  });

  const listaCarboidratos = [...idsCarboidratoUsados].map((id) => {
    const item = CARBOIDRATOS_ALMOCO.find((c) => c.id === id);
    return { nome: item ? item.nome : id, quantidade: '1 pacote' };
  });

  const listaLegumes = [...legumesUsados].map((nome) => ({ nome, quantidade: 'algumas unidades' }));
  const listaSaladas = [...saladasUsadas].map((nome) => ({ nome, quantidade: '1 maço' }));

  return {
    proteinas: listaProteinas,
    carboidratos: listaCarboidratos,
    legumes: listaLegumes,
    saladas: listaSaladas,
  };
}
