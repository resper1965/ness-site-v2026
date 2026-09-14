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

/**
 * Quando a última palavra do título já assentou, e o ponto pode pousar.
 *
 * Cada palavra sobe em `--dur-titulo` (900 ms) com `--ease-sair`, escalonada
 * 45 ms da anterior. Com essa curva, a palavra está visualmente parada por
 * volta da metade da duração (a curva já passou de 90 %); é esse o instante que importa, não o
 * início da sua subida. O ponto azul só pousa depois dele, e o lede e as
 * ações esperam o ponto. Antes contávamos só o escalonamento (45 ms por
 * palavra mais 250), e o ponto pousava com o título ainda subindo.
 */
const PALAVRA_ASSENTA_MS = 450;
const PASSO_DA_PALAVRA_MS = 45;

export function atrasoDoTitulo(palavras: number): number {
  return Math.max(palavras - 1, 0) * PASSO_DA_PALAVRA_MS + PALAVRA_ASSENTA_MS;
}
