import type { CSSProperties } from 'react';

/**
 * A convenção de sequência do movimento (docs/PLAN-movimento.md, seção 3):
 * o elemento escalonado sai do servidor com `--i` (o índice do map) e o CSS
 * calcula o atraso. Sem hook, sem observer, sem estado. `atraso` é a folga
 * que a sequência espera antes de começar (o lede espera o título pousar).
 */
export function sequencia(i: number, atraso?: string): CSSProperties {
  return { '--i': i, ...(atraso ? { '--atraso': atraso } : {}) } as unknown as CSSProperties;
}

/** Quanto o título leva para subir: 45 ms por palavra, mais o pouso do ponto. */
export function atrasoDoTitulo(palavras: number): number {
  return palavras * 45 + 250;
}
