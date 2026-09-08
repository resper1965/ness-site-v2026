import { describe, expect, it } from 'vitest';
import { pageMeta } from './meta';

const titulo = (saida: ReturnType<typeof pageMeta>) =>
  (saida.find((tag) => 'title' in tag) as { title: string } | undefined)?.title ?? '';

const conteudo = (saida: ReturnType<typeof pageMeta>, chave: string, valor: string) =>
  saida.find((tag) => (tag as Record<string, string>)[chave] === valor) as Record<string, string> | undefined;

describe('pageMeta', () => {
  // "IT Company" descreve a ness., a empresa. Colado nas sub-marcas, descreve
  // errado o que cada uma é — trustness. é GRC, forense.io é perícia digital.
  it('só a marca-mãe carrega o descritor corporativo', () => {
    expect(titulo(pageMeta('ness', '/sobre', { title: 'sobre' }))).toBe('sobre — ness. IT Company');
    expect(titulo(pageMeta('trustness', '/sobre', { title: 'sobre' }))).toBe('sobre — trustness.');
    expect(titulo(pageMeta('forense', '/sobre', { title: 'sobre' }))).toBe('sobre — forense.io');
  });

  it('sem título de página, sobra a marca sozinha', () => {
    expect(titulo(pageMeta('trustness', '/', {}))).toBe('trustness.');
    expect(titulo(pageMeta('forense', '/', {}))).toBe('forense.io');
  });

  // Regressão real: o fallback da raiz já trazia a marca no título, e o
  // sufixo era acrescentado de novo.
  it('nunca repete o sufixo', () => {
    for (const marca of ['ness', 'trustness', 'forense'] as const) {
      const t = titulo(pageMeta(marca, '/', { title: 'x' }));
      expect(t.split(' — ').length, t).toBe(2);
    }
  });

  it('canonical aponta para o domínio de produção da marca', () => {
    const saida = pageMeta('forense', '/blog', { title: 'insights' });
    expect(conteudo(saida, 'rel', 'canonical')?.href).toBe('https://forense.io/blog');
  });

  it('og:site_name é a marca isolada', () => {
    expect(conteudo(pageMeta('trustness', '/', {}), 'property', 'og:site_name')?.content).toBe('trustness.');
  });
});
