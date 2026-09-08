/**
 * Sitemap por marca, gerado na edge conforme o Host.
 * Inclui as rotas estáticas da marca e os slugs publicados de blog e portfólio
 * lidos do D1, com `lastmod`. Cacheado por 1 h na edge.
 */
type Env = {
  DB?: { prepare: (q: string) => { bind: (...a: unknown[]) => { all: () => Promise<{ results: Record<string, string>[] }> } } };
};

type Brand = 'ness' | 'trustness' | 'forense';

const DOMAINS: Record<Brand, string> = {
  ness: 'https://ness.com.br',
  trustness: 'https://trustness.com.br',
  forense: 'https://forense.io',
};

const STATIC_ROUTES: Record<Brand, { path: string; changefreq: string; priority: string }[]> = {
  ness: [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/solucoes', changefreq: 'weekly', priority: '0.9' },
    { path: '/solucoes/secops', changefreq: 'monthly', priority: '0.9' },
    { path: '/solucoes/infraops', changefreq: 'monthly', priority: '0.8' },
    { path: '/solucoes/devarch', changefreq: 'monthly', priority: '0.8' },
    { path: '/solucoes/autoops', changefreq: 'monthly', priority: '0.8' },
    { path: '/solucoes/cirt', changefreq: 'monthly', priority: '0.9' },
    { path: '/assessment/cyber', changefreq: 'monthly', priority: '0.8' },
    { path: '/sobre', changefreq: 'monthly', priority: '0.7' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.7' },
    { path: '/blog', changefreq: 'daily', priority: '0.8' },
    { path: '/carreiras', changefreq: 'weekly', priority: '0.6' },
    { path: '/contato', changefreq: 'monthly', priority: '0.6' },
    { path: '/compliance/privacidade', changefreq: 'yearly', priority: '0.3' },
    { path: '/compliance/termos', changefreq: 'yearly', priority: '0.3' },
  ],
  trustness: [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/dpo-as-a-service', changefreq: 'monthly', priority: '0.9' },
    { path: '/assessment/lgpd', changefreq: 'monthly', priority: '0.8' },
    { path: '/sobre', changefreq: 'monthly', priority: '0.6' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.6' },
    { path: '/blog', changefreq: 'daily', priority: '0.7' },
    { path: '/contato', changefreq: 'monthly', priority: '0.5' },
  ],
  forense: [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/sobre', changefreq: 'monthly', priority: '0.6' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.6' },
    { path: '/blog', changefreq: 'daily', priority: '0.7' },
    { path: '/contato', changefreq: 'monthly', priority: '0.5' },
  ],
};

export function brandFromHost(host: string): Brand {
  if (host.includes('trustness')) return 'trustness';
  if (host.includes('forense')) return 'forense';
  return 'ness';
}

const escapeXml = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string));

const edgeCache = () => (caches as unknown as { default: Cache }).default;

export async function sitemap(request: Request, env: Env): Promise<Response> {
  const cache = edgeCache();
  const cached = await cache.match(request);
  if (cached) return cached;

  const brand = brandFromHost(new URL(request.url).hostname);
  const domain = DOMAINS[brand];
  const today = new Date().toISOString().slice(0, 10);

  const urls: string[] = STATIC_ROUTES[brand].map(
    (r) => `  <url><loc>${domain}${r.path}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
  );

  // Conteúdo dinâmico (blog e portfólio) publicado em pt
  if (env.DB) {
    for (const [collection, prefix] of [['insights', '/blog/'], ['cases', '/portfolio/']] as const) {
      try {
        const { results } = await env.DB.prepare(
          `SELECT e.slug, COALESCE(e.updated_at, e.created_at) AS lastmod
           FROM entries e JOIN collections col ON e.collection_id = col.id
           WHERE col.slug = ? AND e.locale = 'pt' AND e.status = 'published' AND e.slug IS NOT NULL`
        ).bind(collection).all();
        for (const row of results) {
          const lastmod = row.lastmod ? String(row.lastmod).slice(0, 10) : today;
          urls.push(`  <url><loc>${domain}${prefix}${escapeXml(row.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
        }
      } catch {
        // D1 indisponível: sitemap segue só com as rotas estáticas
      }
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
  await cache.put(request, response.clone());
  return response;
}
