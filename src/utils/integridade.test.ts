import { describe, expect, it } from 'vitest';

/**
 * O leitor é um CISO comparando fornecedores: ele desconta a página inteira
 * quando reconhece um número sem fonte ou um painel de mentira (PRODUCT.md).
 * O teste de soluções só olha os dados de produto; estas regras valem para o
 * site todo — componentes, páginas e os textos dos três idiomas.
 */
const arquivos = import.meta.glob(['../**/*.{ts,tsx,json}', '!../**/*.test.*', '!../mocks/**'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function ofensores(padrao: RegExp): string[] {
  return Object.entries(arquivos)
    .filter(([, texto]) => padrao.test(texto))
    .map(([caminho, texto]) => `${caminho}: ${texto.match(padrao)?.[0]}`);
}

describe('integridade do que vai ao ar', () => {
  it('nenhum status de sistema inventado', () => {
    expect(ofensores(/system live status|status:\s*optimal/i)).toEqual([]);
  });

  it('nenhum "100% de confidencialidade"', () => {
    expect(ofensores(/100\s*%\s*(de\s+)?confiden/i)).toEqual([]);
  });

  it('nenhuma certificação alegada sem nome, escopo e ano', () => {
    expect(ofensores(/(auditad|audited)[^"]{0,80}ISO 27001/i)).toEqual([]);
  });

  // O número de SLA fica na proposta; o que vai ao ar é o modelo.
  it('nenhum prazo de SLA publicado', () => {
    expect(ofensores(/SLA com resposta|em at[ée] \d+\s*h\b|sla \/ uptime/i)).toEqual([]);
  });

  it('nenhum superlativo de elite', () => {
    // Com `u`: sem ele o \b não enxerga o "é" e "de élite" passava.
    expect(ofensores(/(?<!\p{L})[ée]lite(?!\p{L})/iu)).toEqual([]);
  });

  it('o sobre não publica país nem selo sem fonte', () => {
    const sobre = arquivos['../pages/About.tsx'];
    expect(sobre).toBeTruthy();
    expect(sobre).not.toMatch(/about\.metrics\.countries|about\.cred\.(global|security)/);
  });

  // Um canal de incidente que diz "aciona o plantão" sem acionar ninguém é o
  // pior defeito possível para quem está com ransomware ativo.
  it('o canal de emergência não promete acionar o plantão e mostra o telefone', () => {
    // A negação é legítima: é ela que instrui o assistente a não prometer.
    expect(ofensores(/(?<!n[ãa]o )aciona o time de plant|será acionado por contato direto/i)).toEqual([]);
    expect(arquivos['../components/EmergencyChatModal.tsx']).toContain('tel:+551125047650');
  });

  // `surface-container` sem sufixo não existe no @theme: a classe não gera
  // CSS e o card fica sem fundo, sem erro nenhum.
  it('nenhuma classe de token inexistente', () => {
    expect(ofensores(/\b(bg|text|border|from|to|via)-surface-container(?![-\w])/)).toEqual([]);
  });

  it('nenhum recurso de terceiro fora da Cloudflare', () => {
    expect(ofensores(/transparenttextures\.com/)).toEqual([]);
  });
});
