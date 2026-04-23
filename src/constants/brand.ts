// ness. brand constants — fonte única de verdade
export const FOUNDATION_DATE = new Date(1991, 5, 12); // 12 de junho de 1991
export const FOUNDATION_YEAR = 1991;
export const FOUNDATION_MONTH = 6; // junho
export const FOUNDATION_DAY = 12;

export const CURRENT_YEAR = new Date().getFullYear();

/** Calcula anos completos desde a fundação, baseado na data exata (12 de junho) */
const now = new Date();
const hadAnniversaryThisYear =
  now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() >= 12);
export const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR - (hadAnniversaryThisYear ? 0 : 1);

/** Data formatada por locale */
export const FOUNDATION_DATE_PT = '12 de junho de 1991';
export const FOUNDATION_DATE_EN = 'june 12, 1991';
export const FOUNDATION_DATE_ES = '12 de junio de 1991';
