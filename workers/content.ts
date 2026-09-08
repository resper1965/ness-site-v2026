/**
 * As consultas de conteúdo publicado, num lugar só.
 *
 * Elas nasceram dentro das rotas de `/api`, para o navegador chamar depois de
 * carregar a página. Os loaders do site precisam das mesmas consultas — só que
 * no servidor, antes de renderizar. Duplicar o SQL seria garantir que um dia
 * as duas versões divergem, então as duas pontas passam a chamar daqui.
 */

type D1Row = Record<string, unknown>;

export type D1 = {
  prepare: (query: string) => {
    bind: (...args: unknown[]) => {
      all: () => Promise<{ results: D1Row[] }>;
      first: () => Promise<D1Row | null>;
    };
  };
};

const CAMPOS_INSIGHT = `e.id, e.locale as lang, e.slug,
       json_extract(e.data, '$.title') as title,
       json_extract(e.data, '$.tag') as tag,
       json_extract(e.data, '$.icon') as icon,
       json_extract(e.data, '$.date') as date,
       json_extract(e.data, '$.desc') as desc,
       json_extract(e.data, '$.featured') as featured`;

const CAMPOS_CASE = `e.id, e.locale as lang, e.slug,
       json_extract(e.data, '$.client') as client,
       json_extract(e.data, '$.category') as category,
       json_extract(e.data, '$.project') as project,
       json_extract(e.data, '$.result') as result,
       json_extract(e.data, '$.desc') as desc,
       json_extract(e.data, '$.stats') as stats,
       json_extract(e.data, '$.image') as image,
       json_extract(e.data, '$.featured') as featured`;

const DE_COLECAO = `FROM entries e
     JOIN collections col ON e.collection_id = col.id`;

export async function listarInsights(db: D1, lang: string): Promise<D1Row[]> {
  const { results } = await db
    .prepare(
      `SELECT ${CAMPOS_INSIGHT}
       ${DE_COLECAO}
       WHERE col.slug = 'insights' AND e.locale = ? AND e.status = 'published'
       ORDER BY date DESC`,
    )
    .bind(lang)
    .all();
  return results;
}

export async function buscarInsight(db: D1, slug: string, lang: string): Promise<D1Row | null> {
  return db
    .prepare(
      `SELECT ${CAMPOS_INSIGHT},
              json_extract(e.data, '$.body') as body
       ${DE_COLECAO}
       WHERE col.slug = 'insights' AND e.slug = ? AND e.locale = ? AND e.status = 'published'
       LIMIT 1`,
    )
    .bind(slug, lang)
    .first();
}

export async function listarCases(db: D1, lang: string): Promise<D1Row[]> {
  const { results } = await db
    .prepare(
      `SELECT ${CAMPOS_CASE}
       ${DE_COLECAO}
       WHERE col.slug = 'cases' AND e.locale = ? AND e.status = 'published'
       ORDER BY featured DESC, e.id ASC`,
    )
    .bind(lang)
    .all();
  return results;
}

export async function buscarCase(db: D1, slug: string, lang: string): Promise<D1Row | null> {
  return db
    .prepare(
      `SELECT ${CAMPOS_CASE}
       ${DE_COLECAO}
       WHERE col.slug = 'cases' AND e.slug = ? AND e.locale = ? AND e.status = 'published'
       LIMIT 1`,
    )
    .bind(slug, lang)
    .first();
}
