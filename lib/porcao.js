// Sistema de porção personalizada — sem IA, só matemática determinística

// Taxa Metabólica Basal — fórmula de Mifflin-St Jeor (mulheres)
export function calcularTMB({ pesoKg, alturaCm, idade }) {
  return 10 * pesoKg + 6.25 * alturaCm - 5 * idade - 161;
}

export function multiplicadorPorTMB(tmb) {
  if (tmb < 1500) return 0.85;
  if (tmb < 1800) return 1.0;
  if (tmb < 2100) return 1.15;
  return 1.3;
}

export function multiplicadorPorRefeicoes(quantidadeRefeicoesAtivas) {
  if (quantidadeRefeicoesAtivas >= 5) return 1.0;
  if (quantidadeRefeicoesAtivas === 4) return 1.1;
  return 1.2; // 3 refeições (mínimo)
}

// Calcula a gramatura final de um item, aplicando os dois multiplicadores
export function calcularPorcaoFinal({ porcaoBaseG, tmb, quantidadeRefeicoesAtivas }) {
  if (!porcaoBaseG) return null; // itens contados por unidade (ex: ovo) não usam isso
  const multTmb = multiplicadorPorTMB(tmb);
  const multRefeicoes = multiplicadorPorRefeicoes(quantidadeRefeicoesAtivas);
  const gramas = porcaoBaseG * multTmb * multRefeicoes;
  return Math.round(gramas / 5) * 5; // arredonda pra múltiplo de 5g, mais fácil de ler
}

// Conta quantas refeições estão ativas a partir do objeto de preferências
export function contarRefeicoesAtivas(refeicoesAtivas) {
  return Object.values(refeicoesAtivas).filter(Boolean).length;
}
