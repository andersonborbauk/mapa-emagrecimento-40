// Receitas reaproveitadas dos ebooks já produzidos (Doce Pode 40+ e DesinCHÁ 40+)
// Populam o "pool" de extras quando doce_pode_40 / desincha_40 = true

export const DOCES = [
  { id: 1, nome: 'Brigadeiro Fit de Panela', kcal: 45 },
  { id: 2, nome: 'Brigadeiro de Colher Proteico', kcal: 80 },
  { id: 3, nome: 'Mousse de Maracujá Light', kcal: 110 },
  { id: 4, nome: 'Mousse de Limão Fit', kcal: 105 },
  { id: 5, nome: 'Picolé de Frutas Vermelhas', kcal: 50 },
  { id: 6, nome: 'Sorvete de Banana com Cacau', kcal: 90 },
  { id: 7, nome: 'Geladinho de Limão Fit', kcal: 25 },
  { id: 8, nome: 'Frozen Yogurt de Morango', kcal: 85 },
  { id: 9, nome: 'Pudim de Chia com Manga', kcal: 110 },
  { id: 10, nome: 'Mousse de Chocolate Express', kcal: 120 },
  { id: 11, nome: 'Cookie Fit de Aveia', kcal: 70 },
  { id: 12, nome: 'Muffin de Maçã e Canela', kcal: 95 },
  { id: 13, nome: 'Trufa de Tâmara com Cacau', kcal: 55 },
  { id: 14, nome: 'Cocada Fit', kcal: 85 },
  { id: 15, nome: 'Creme de Papaya com Cassis', kcal: 95 },
];

export const CHAS = [
  {
    id: 1, nome: 'Chá de Gengibre com Limão e Mel', beneficio: 'Termogênico + digestivo',
    horario: 'Café da manhã',
    ingredientes: '2cm gengibre fatiado, suco de 1 limão, 1 col mel, 300ml água quente',
    preparo: 'Ferva a água com o gengibre por 5 min. Coe, adicione limão e mel. Beba morno.',
  },
  {
    id: 2, nome: 'Chá de Hibisco com Canela', beneficio: 'Diurético + anti-inflamatório',
    horario: 'Café da manhã',
    ingredientes: '1 col chá de hibisco seco, 1 pau de canela, 300ml água quente',
    preparo: 'Despeje a água quente sobre o hibisco e a canela. Deixe em infusão por 5 min. Coe e beba.',
  },
  {
    id: 3, nome: 'Chá Verde com Hortelã', beneficio: 'Termogênico + refrescante',
    horario: 'Café da manhã',
    ingredientes: '1 sachê chá verde, 4 folhas de hortelã, 300ml água quente',
    preparo: 'Prepare o chá verde por 3 min. Adicione as folhas de hortelã. Coe e beba morno ou gelado.',
  },
  {
    id: 4, nome: 'Chá de Canela com Cravo', beneficio: 'Glicemia + termogênico',
    horario: 'Café da manhã',
    ingredientes: '1 pau de canela, 3 cravos, 300ml água',
    preparo: 'Ferva a água com canela e cravo por 10 min. Coe e beba morno.',
  },
  {
    id: 5, nome: 'Chá de Cavalinha com Limão', beneficio: 'Diurético potente',
    horario: 'Café da manhã',
    ingredientes: '1 col chá de cavalinha seca, suco de 1/2 limão, 300ml água quente',
    preparo: 'Despeje a água quente sobre a cavalinha. Infuse por 8 min, coe, adicione limão e beba.',
  },
  {
    id: 6, nome: 'Chá de Gengibre com Laranja e Cúrcuma', beneficio: 'Anti-inflamatório + imunidade',
    horario: 'Café da manhã',
    ingredientes: '2cm gengibre, casca de 1/2 laranja, 1 pitada de cúrcuma, 300ml água quente',
    preparo: 'Ferva a água com gengibre e casca de laranja por 5 min. Coe, adicione cúrcuma e beba.',
  },
  {
    id: 7, nome: 'Chá de Erva Doce com Camomila', beneficio: 'Antigás + relaxante',
    horario: 'Café da manhã',
    ingredientes: '1 col chá de erva doce, 1 sachê camomila, 300ml água quente',
    preparo: 'Despeje a água quente sobre os ingredientes. Infuse por 5 min, coe e beba.',
  },
  {
    id: 8, nome: 'Chá de Casca de Abacaxi com Hortelã', beneficio: 'Diurético + digestivo',
    horario: 'Café da manhã',
    ingredientes: 'Casca de 1/4 abacaxi, 4 folhas hortelã, 500ml água',
    preparo: 'Ferva a casca de abacaxi com a água por 15 min. Coe, adicione hortelã e beba morno ou gelado.',
  },
];

export const SUCOS = [
  {
    id: 1, nome: 'Suco Verde Desinchante', beneficio: 'Diurético + fibras',
    horario: 'Lanche da tarde',
    ingredientes: '2 folhas couve, 1 pepino, 1 maçã verde, suco 1/2 limão, 200ml água',
    preparo: 'Bata tudo no liquidificador. Beba sem coar para aproveitar as fibras.',
  },
  {
    id: 2, nome: 'Suco de Abacaxi com Gengibre e Hortelã', beneficio: 'Digestivo + anti-inflamatório',
    horario: 'Lanche da tarde',
    ingredientes: '2 fatias abacaxi, 1cm gengibre, 4 folhas hortelã, 200ml água gelada',
    preparo: 'Bata todos os ingredientes no liquidificador. Sirva com gelo.',
  },
  {
    id: 3, nome: 'Suco de Melancia com Gengibre', beneficio: 'Diurético + refrescante',
    horario: 'Lanche da tarde',
    ingredientes: '2 xíc melancia sem semente, 1cm gengibre, suco 1/2 limão, gelo',
    preparo: 'Bata a melancia com o gengibre. Adicione limão e gelo. Sirva gelado.',
  },
  {
    id: 4, nome: 'Suco de Beterraba com Laranja e Gengibre', beneficio: 'Antioxidante + energia',
    horario: 'Lanche da tarde',
    ingredientes: '1/2 beterraba pequena, 2 laranjas espremidas, 1cm gengibre, 100ml água',
    preparo: 'Bata a beterraba com a água e o gengibre. Adicione o suco de laranja. Coe se preferir.',
  },
  {
    id: 5, nome: 'Suco de Pepino com Limão e Hortelã', beneficio: 'Diurético suave + refrescante',
    horario: 'Lanche da tarde',
    ingredientes: '1 pepino com casca, suco de 1 limão, 5 folhas hortelã, 200ml água gelada',
    preparo: 'Bata tudo no liquidificador. Sirva imediatamente sem coar.',
  },
  {
    id: 6, nome: 'Suco de Maçã Verde com Cenoura e Gengibre', beneficio: 'Fibras + termogênico',
    horario: 'Lanche da tarde',
    ingredientes: '1 maçã verde, 1 cenoura, 1cm gengibre, 200ml água',
    preparo: 'Bata todos os ingredientes. Beba sem coar para aproveitar as fibras.',
  },
  {
    id: 7, nome: 'Suco de Abacaxi com Couve e Água de Coco', beneficio: 'Desinchante + minerais',
    horario: 'Lanche da tarde',
    ingredientes: '2 fatias abacaxi, 2 folhas couve, 200ml água de coco',
    preparo: 'Bata tudo no liquidificador. Sirva gelado. Não precisa coar.',
  },
];

// Cota semanal de doces — não é por dia, é quantidade liberada na semana inteira
export function cotaDocesDaSemana(numeroSemana) {
  if (numeroSemana <= 1) return 1;
  if (numeroSemana === 2) return 2;
  return 3; // semana 3 em diante
}
