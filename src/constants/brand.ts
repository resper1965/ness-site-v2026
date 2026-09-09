// ness. brand constants — fonte única de verdade
export const FOUNDATION_DATE = new Date(1991, 5, 12); // 12 de junho de 1991
export const FOUNDATION_YEAR = 1991;
export const FOUNDATION_MONTH = 6; // junho
export const FOUNDATION_DAY = 12;

/**
 * O ano e o tempo de casa são funções, não constantes de módulo.
 *
 * No workerd o relógio fica congelado fora de uma requisição: `new Date()`
 * avaliado na importação devolve o epoch. Como constante, `CURRENT_YEAR` valia
 * 1970 no servidor e o tempo de casa saía **negativo** — o HTML da edge dizia
 * "-22 anos", que é o que scraper e buscador liam. Chamadas durante o render
 * de uma requisição enxergam a hora de verdade.
 */
export function anoAtual(agora: Date = new Date()): number {
  return agora.getFullYear();
}

/** Anos completos desde a fundação, contados a partir de 12 de junho. */
export function anosDeLegado(agora: Date = new Date()): number {
  const passouOAniversario =
    agora.getMonth() > 5 || (agora.getMonth() === 5 && agora.getDate() >= 12);
  return agora.getFullYear() - FOUNDATION_YEAR - (passouOAniversario ? 0 : 1);
}

/** Data formatada por locale */
export const FOUNDATION_DATE_PT = '12 de junho de 1991';
export const FOUNDATION_DATE_EN = 'june 12, 1991';
export const FOUNDATION_DATE_ES = '12 de junio de 1991';
