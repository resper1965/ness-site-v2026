import { describe, expect, it } from 'vitest';
import { anoAtual, anosDeLegado, FOUNDATION_YEAR } from './brand';

describe('tempo de casa', () => {
  it('conta o ano cheio depois do aniversário, em 12 de junho', () => {
    expect(anosDeLegado(new Date(2026, 5, 12))).toBe(35);
    expect(anosDeLegado(new Date(2026, 11, 31))).toBe(35);
  });

  it('não conta o ano corrente antes do aniversário', () => {
    expect(anosDeLegado(new Date(2026, 5, 11))).toBe(34);
    expect(anosDeLegado(new Date(2026, 0, 1))).toBe(34);
  });

  // O bug que motivou virar função: no workerd o relógio fica congelado fora
  // de uma requisição, `new Date()` na importação devolve o epoch, e o HTML
  // do servidor saía com "-22 anos".
  it('mostra o defeito do relógio congelado — e por isso não é constante', () => {
    // 1969 ou 1970 conforme o fuso de quem roda o teste — no Worker é UTC.
    const epoch = new Date(0);
    expect(anoAtual(epoch)).toBeLessThan(1971);
    expect(anosDeLegado(epoch)).toBeLessThan(0);
  });

  it('sem argumento, usa a hora da chamada — que num request é a real', () => {
    expect(anoAtual()).toBeGreaterThanOrEqual(2026);
    expect(anosDeLegado()).toBeGreaterThanOrEqual(anoAtual() - FOUNDATION_YEAR - 1);
  });
});
