import { describe, expect, it } from 'vitest';
import { solutionsData } from './solutionsData';

/**
 * O conteúdo de produto é lido por um comprador que compara fornecedores.
 * Absoluto sem fonte é o que ele desconta primeiro — e foi exatamente o que
 * o bloco `dashboard` publicava: "100% postura atualizada", "0 gaps".
 */
const ABSOLUTOS = /\b100\s*%|\b0\s+gaps?\b|zero\s+downtime|\b100\s+por\s+cento\b/i;

function textos(valor: unknown): string[] {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos);
  return [];
}

describe('conteúdo das soluções', () => {
  for (const [slug, dados] of Object.entries(solutionsData)) {
    it(`${slug} não publica absoluto sem fonte`, () => {
      const ofensores = textos(dados).filter((t) => ABSOLUTOS.test(t));
      expect(ofensores).toEqual([]);
    });

    it(`${slug} não tem mais dashboard nem benefits`, () => {
      expect(dados).not.toHaveProperty('dashboard');
      expect(dados).not.toHaveProperty('benefits');
    });
  }
});
