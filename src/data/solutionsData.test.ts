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

/**
 * Numero de SLA nao vai ao ar: a decisao foi publicar o modelo de resposta e
 * deixar o prazo na proposta comercial. A regra vale para os campos de
 * compromisso — titulo, descricao e resumo — e NAO para `portfolio`, onde um
 * numero descreve o que aconteceu num caso, nao o que se promete ao proximo
 * cliente. Sao coisas diferentes: uma e promessa, a outra e fato.
 */
const PRAZO_DE_COMPROMISSO = /SLA de \d|em at[ée] \d+\s*(minuto|hora)/i;
const CAMPOS_DE_COMPROMISSO = ['metaTitle', 'metaDescription', 'overview'] as const;

/**
 * Produto que volta com a ficha preenchida passa ao desenho por diagramas, e o
 * desenho precisa de todas as partes: diagrama pela metade é pior que o card
 * antigo. `promessa` é o que liga o desenho novo na página.
 */
const PARTES_DO_DESENHO = ['apresentacao', 'fontes', 'severidade', 'escopo', 'entregaveis', 'operacao', 'fecho'] as const;

/**
 * Produto no formato antigo (sem `promessa`) ainda não passou pela ficha
 * validada pelo time: nele não vai ao ar número com unidade — prazo, ganho ou
 * valor —, nem case, nem caso de uso. Quando a ficha voltar, o número entra
 * com a fonte registrada em docs/PESQUISA-metricas.md.
 */
const NUMERO_COM_UNIDADE = /\d[\d.,]*\s*(?:-\s*\d+\s*)?(?:minutos?\b|min\b|horas?\b|h\b|semanas?\b|s\b|dias?\b|meses\b|milh|mil\b|%)|R\$\s*\d|<=\s*\d/i;

describe('conteúdo das soluções', () => {
  it('o n.secops já está no desenho por diagramas', () => {
    expect(solutionsData.secops.promessa).toBeTruthy();
  });

  for (const [slug, dados] of Object.entries(solutionsData)) {
    it(`${slug}, se está no desenho novo, tem todas as partes`, () => {
      if (!dados.promessa) return;
      expect(PARTES_DO_DESENHO.filter((parte) => !dados[parte])).toEqual([]);
    });

    it(`${slug} não publica absoluto sem fonte`, () => {
      const ofensores = textos(dados).filter((t) => ABSOLUTOS.test(t));
      expect(ofensores).toEqual([]);
    });

    it(`${slug} não promete prazo de SLA nos campos de compromisso`, () => {
      const ofensores = CAMPOS_DE_COMPROMISSO
        .map((campo) => (dados as unknown as Record<string, unknown>)[campo])
        .filter((v): v is string => typeof v === 'string')
        .filter((v) => PRAZO_DE_COMPROMISSO.test(v));
      expect(ofensores).toEqual([]);
    });

    it(`${slug} não tem mais dashboard nem benefits`, () => {
      expect(dados).not.toHaveProperty('dashboard');
      expect(dados).not.toHaveProperty('benefits');
    });

    it(`${slug}, sem ficha, não publica número com unidade`, () => {
      if (dados.promessa) return;
      expect(textos(dados).filter((t) => NUMERO_COM_UNIDADE.test(t))).toEqual([]);
    });

    it(`${slug}, sem ficha, não publica case nem caso de uso`, () => {
      if (dados.promessa) return;
      expect(dados.portfolio ?? []).toEqual([]);
      expect(dados.useCases ?? []).toEqual([]);
    });
  }
});
