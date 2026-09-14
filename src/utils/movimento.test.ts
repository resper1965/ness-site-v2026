import { describe, expect, it } from 'vitest';
import { atrasoDoTitulo, sequencia } from './movimento';

// A sequência da abertura (docs/PLAN-movimento.md, 4.1): o ponto azul pousa
// depois de a última palavra assentar, e nunca antes de a primeira assentar.
describe('atrasoDoTitulo', () => {
  const passo = 45;
  const assenta = 450;

  it('espera a última palavra assentar antes de o ponto pousar', () => {
    for (const palavras of [1, 4, 8, 12]) {
      const ultimaAssenta = (palavras - 1) * passo + assenta;
      expect(atrasoDoTitulo(palavras)).toBeGreaterThanOrEqual(ultimaAssenta);
    }
  });

  it('com título que não é string, o ponto ainda espera a entrada do bloco', () => {
    expect(atrasoDoTitulo(0)).toBe(assenta);
  });

  it('cabe no orçamento da abertura: oito palavras pousam antes de 1,5 s', () => {
    expect(atrasoDoTitulo(8) + 500).toBeLessThan(1_500);
  });
});

describe('sequencia', () => {
  it('sai como variáveis CSS para o servidor', () => {
    expect(sequencia(3)).toEqual({ '--i': 3 });
    expect(sequencia(0, '730ms')).toEqual({ '--i': 0, '--atraso': '730ms' });
  });
});
