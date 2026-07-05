import { PROTEINAS, CARBOIDRATOS_ALMOCO, LEGUMES_LIBERADOS, SALADAS_FOLHA, FRUTAS_LEVES, listarCarboidratosPorTipo } from './alimentos';
import { calcularPorcaoFinal } from './porcao';

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// A Semana 1 sempre começa na segunda-feira seguinte ao cadastro.
// Enquanto isso não chega, a cliente já vê a lista de compras pra se organizar.
export function calcularInicioSemana1(dataCadastro) {
  const data = new Date(dataCadastro);
  const diaDaSemana = data.getDay(); // 0 = domingo, 1 = segunda, ...
  const diasAteSegunda = diaDaSemana === 1 ? 0 : (8 - diaDaSemana) % 7 || 7;
  const inicio = new Date(data);
  inicio.setDate(data.getDate() + (diaDaSemana === 1 ? 0 : diasAteSegunda));
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

export function calcularNumeroSemanaAtual(dataCadastro, hoje = new Date()) {
  const inicioSemana1 = calcularInicioSemana1(dataCadastro);
  if (hoje < inicioSemana1) return 0; // ainda no período de preparação, antes da Semana 1 começar
  const diffMs = hoje - inicioSemana1;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.floor(diffDias / 7) + 1;
}

// Rotaciona itens de uma lista de preferências ao longo dos 7 dias, sem repetir
// mais que o necessário (round-robin simples)
function rotacionar(lista, diaIndex) {
  if (!lista || lista.length === 0) return null;
  return lista[diaIndex % lista.length];
}

/**
 * Monta o plano da semana inteira pra uma cliente, com base em:
 * - refeicoesAtivas: { cafe, almoco, lanche, jantar, ceia } (bool cada)
 * - preferencias: { proteinas: [ids], carboidratos: [ids], laticinios: [ids] }
 * - tmb: número (kcal)
 * - entitlements: { doce_pode_40, desincha_40 }
 */
export function montarPlanoSemanal({ refeicoesAtivas, preferencias, tmb }) {
  const quantidadeRefeicoesAtivas = Object.values(refeicoesAtivas).filter(Boolean).length;

  const proteinasEscolhidas = PROTEINAS.filter((p) => preferencias.proteinas?.includes(p.id));
  const carboidratosEscolhidos = CARBOIDRATOS_ALMOCO.filter((c) => preferencias.carboidratos?.includes(c.id));

  const plano = DIAS_SEMANA.map((dia, diaIndex) => {
    const refeicoesDoDia = {};

    if (refeicoesAtivas.cafe) {
      const proteinaCafe = rotacionar(proteinasEscolhidas.filter((p) => p.id === 'ovo' || p.id === 'queijo_branco' || p.id === 'iogurte_natural'), diaIndex)
        || rotacionar(proteinasEscolhidas, diaIndex);
      const fruta = rotacionar(FRUTAS_LEVES, diaIndex);
      refeicoesDoDia.cafe = {
        itens: [
          proteinaCafe ? montarItemProteina(proteinaCafe, tmb, quantidadeRefeicoesAtivas) : null,
          fruta ? { nome: fruta.nome, tipo: 'fruta' } : null,
        ].filter(Boolean),
      };
    }

    if (refeicoesAtivas.almoco) {
      const proteina = rotacionar(proteinasEscolhidas, diaIndex);
      const carbo = rotacionar(carboidratosEscolhidos, diaIndex);
      refeicoesDoDia.almoco = {
        itens: [
          proteina ? montarItemProteina(proteina, tmb, quantidadeRefeicoesAtivas) : null,
          carbo ? montarItemCarboidrato(carbo, tmb, quantidadeRefeicoesAtivas) : null,
          { nome: `Legume à vontade (${LEGUMES_LIBERADOS[diaIndex % LEGUMES_LIBERADOS.length]})`, tipo: 'legume' },
          { nome: `Salada à vontade (${SALADAS_FOLHA[diaIndex % SALADAS_FOLHA.length]})`, tipo: 'salada' },
        ].filter(Boolean),
      };
    }

    if (refeicoesAtivas.lanche) {
      const item = rotacionar(proteinasEscolhidas.filter((p) => p.adequadoCeia), diaIndex);
      refeicoesDoDia.lanche = {
        itens: [item ? montarItemProteina(item, tmb, quantidadeRefeicoesAtivas) : null].filter(Boolean),
      };
    }

    if (refeicoesAtivas.jantar) {
      const proteina = rotacionar(proteinasEscolhidas, (diaIndex + 3) % proteinasEscolhidas.length); // desloca pra variar do almoço
      refeicoesDoDia.jantar = {
        itens: [
          proteina ? montarItemProteina(proteina, tmb, quantidadeRefeicoesAtivas) : null,
          { nome: `Legume específico (${LEGUMES_LIBERADOS[(diaIndex + 2) % LEGUMES_LIBERADOS.length]})`, tipo: 'legume' },
          { nome: `Salada à vontade (${SALADAS_FOLHA[(diaIndex + 1) % SALADAS_FOLHA.length]})`, tipo: 'salada' },
        ].filter(Boolean),
      };
    }

    if (refeicoesAtivas.ceia) {
      const item = rotacionar(proteinasEscolhidas.filter((p) => p.adequadoCeia), diaIndex);
      const frutaCeia = rotacionar(FRUTAS_LEVES.filter((f) => f.adequadoCeia), diaIndex);
      refeicoesDoDia.ceia = {
        itens: [
          item ? montarItemProteina(item, tmb, quantidadeRefeicoesAtivas) : null,
          frutaCeia ? { nome: frutaCeia.nome, tipo: 'fruta' } : null,
        ].filter(Boolean),
      };
    }

    return { dia, refeicoes: refeicoesDoDia };
  });

  return plano;
}

function montarItemProteina(item, tmb, quantidadeRefeicoesAtivas) {
  if (item.porcaoBaseUnidade) {
    return { nome: item.nome, tipo: 'proteina', quantidade: `${item.porcaoBaseUnidade} unidades` };
  }
  const gramas = calcularPorcaoFinal({ porcaoBaseG: item.porcaoBaseG, tmb, quantidadeRefeicoesAtivas });
  return { nome: item.nome, tipo: 'proteina', quantidade: `${gramas}g`, id: item.id, gramasPronto: gramas };
}

function montarItemCarboidrato(item, tmb, quantidadeRefeicoesAtivas) {
  const gramas = calcularPorcaoFinal({ porcaoBaseG: item.porcaoBaseG, tmb, quantidadeRefeicoesAtivas });
  const colherEquivalente = item.porcaoBaseColher ? ` (≈ ${item.porcaoBaseColher})` : '';
  return { nome: item.nome, tipo: 'carboidrato', quantidade: `${gramas}g${colherEquivalente}`, id: item.id, gramasPronto: gramas };
}
