import { brandFromHost } from './sitemap';

const DOMAINS = {
  ness: 'https://ness.com.br',
  trustness: 'https://trustness.com.br',
  forense: 'https://forense.io',
} as const;

/** robots.txt por marca: aponta apenas para o sitemap do próprio host. */
export async function robots(request: Request): Promise<Response> {
  const brand = brandFromHost(new URL(request.url).hostname);
  const body = `# ${brand} — robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# AI crawlers — welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${DOMAINS[brand]}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
