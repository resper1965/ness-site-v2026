import { test, expect } from '@playwright/test';

/**
 * Smoke do site público: metadados por rota, ausência de overlays não
 * solicitados, chat só por clique, 404 real e orçamento de peso inicial.
 * Os bugs B-01..B-07 do PLAN-performance-ux-comercial.md ficam cobertos aqui.
 */

test.describe('metadados por rota', () => {
  const cases: { path: string; title: RegExp; canonical: string }[] = [
    { path: '/', title: /tecnologia digital de precisão — ness\./, canonical: 'https://ness.com.br/' },
    { path: '/contato', title: /contato — fale com um especialista/, canonical: 'https://ness.com.br/contato' },
    { path: '/solucoes/secops', title: /n\.secops — SOC 24×7/, canonical: 'https://ness.com.br/solucoes/secops' },
    { path: '/solucoes/cirt', title: /n\.cirt — resposta a incidentes/, canonical: 'https://ness.com.br/solucoes/cirt' },
  ];

  for (const c of cases) {
    test(`${c.path} tem título e canonical próprios`, async ({ page }) => {
      await page.goto(c.path);
      await expect(page).toHaveTitle(c.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', c.canonical);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
      await expect(page.locator('h1').first()).toBeVisible();
    });
  }

  // Os testes acima leem a página já hidratada. Este lê o HTML cru, como um
  // scraper de LinkedIn ou WhatsApp, que não executa JavaScript: é o que a
  // renderização na edge existe para consertar.
  test('o HTML do servidor já traz os metadados da rota', async ({ request }) => {
    const casos = [
      { path: '/', titulo: 'tecnologia digital de precisão', canonical: 'https://ness.com.br/' },
      { path: '/contato', titulo: 'contato — fale com um especialista', canonical: 'https://ness.com.br/contato' },
      { path: '/solucoes/secops', titulo: 'n.secops', canonical: 'https://ness.com.br/solucoes/secops' },
      { path: '/sobre', titulo: 'sobre a ness.', canonical: 'https://ness.com.br/sobre' },
    ];

    for (const c of casos) {
      const html = await (await request.get(c.path)).text();
      expect(html, c.path).toContain(`<title>`);
      expect(html.match(/<title>([^<]*)<\/title>/)?.[1], c.path).toContain(c.titulo);
      expect(html, c.path).toContain(`href="${c.canonical}"`);
      expect(html, c.path).toContain('property="og:title"');
      expect(html, c.path).toContain('content="index, follow"');
    }
  });

  // O sufixo da marca é acrescentado por pageMeta. Repeti-lo no título da
  // própria página produz "… — ness. IT Company — ness. IT Company", que já
  // aconteceu com o fallback da raiz.
  test('nenhuma rota repete o sufixo da marca no título', async ({ request }) => {
    for (const path of ['/', '/assessment/cyber', '/contato', '/blog']) {
      const html = await (await request.get(path)).text();
      const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
      expect(titulo.match(/IT Company/g)?.length ?? 0, `${path}: ${titulo}`).toBeLessThan(2);
    }
  });

  test('slug de solução inexistente renderiza 404 com noindex', async ({ page }) => {
    await page.goto('/solucoes/devsecops');
    await expect(page.locator('h1')).toContainText('página não encontrada');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });
});

test.describe('conteúdo do CMS no HTML', () => {
  // O D1 local (miniflare) está vazio; estas asserções só valem contra um
  // ambiente com o banco de verdade, que é o preview do PR.
  test.skip(!process.env.SITE_BASE_URL, 'precisa do D1 com conteúdo');

  test('a lista do blog sai renderizada do servidor', async ({ request }) => {
    const html = await (await request.get('/blog')).text();
    const links = html.match(/href="\/blog\/[a-z0-9-]+"/g) ?? [];
    expect(links.length, 'nenhum link de post no HTML cru').toBeGreaterThan(0);
  });

  test('o post traz o corpo e og:type article no HTML cru', async ({ request }) => {
    const lista = await (await request.get('/blog')).text();
    const slug = lista.match(/href="\/blog\/([a-z0-9-]+)"/)?.[1];
    expect(slug, 'nenhum post publicado para testar').toBeTruthy();

    const resposta = await request.get(`/blog/${slug}`);
    expect(resposta.status()).toBe(200);
    const html = await resposta.text();
    expect(html).toContain('content="article"');
    // O corpo do artigo é markdown renderizado: sem ele a página é uma casca.
    expect(html.match(/<p[^>]*>/g)?.length ?? 0, 'sem parágrafos no HTML').toBeGreaterThan(1);
  });

  test('slug inexistente devolve 404', async ({ request }) => {
    expect((await request.get('/blog/nao-existe-mesmo')).status()).toBe(404);
    expect((await request.get('/portfolio/nao-existe-mesmo')).status()).toBe(404);
  });
});

test.describe('primeira visita sem interrupções', () => {
  test('nenhum modal ou chat abre sozinho', async ({ page }) => {
    await page.goto('/solucoes/secops');
    await page.waitForTimeout(9_000); // antes: popup em 1,5 s e chat em 8 s
    await expect(page.locator('[role="dialog"], .fixed.inset-0')).toHaveCount(0);
    await expect(page.getByPlaceholder(/digite sua mensagem/i)).toHaveCount(0);
  });

  test('chat abre apenas ao clicar no botão', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /gabi/i }).click();
    await expect(page.getByPlaceholder(/digite sua mensagem/i)).toBeVisible({ timeout: 10_000 });
  });

  test('menu mobile abre, fecha com Esc e mantém o CTA visível', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'somente mobile');
    await page.goto('/');
    await expect(page.getByRole('link', { name: /contato/i }).first()).toBeVisible();
    await page.getByRole('button', { name: /abrir menu/i }).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  });
});

test.describe('orçamento de performance', () => {
  test('home não carrega terceiros no caminho crítico e cabe no orçamento', async ({ page }) => {
    const external: string[] = [];
    let bytes = 0;
    let comprimidas = 0;
    page.on('response', async (res) => {
      const url = res.url();
      if (!url.startsWith('http://127.0.0.1') && !url.includes(process.env.SITE_BASE_URL || '127.0.0.1')) external.push(url);
      if (res.headers()['content-encoding']) comprimidas += 1;
      bytes += Number(res.headers()['content-length'] || 0);
    });
    await page.goto('/', { waitUntil: 'load' });

    const critical = external.filter((u) => /unsplash|fonts\.googleapis|fonts\.gstatic|clearbit/.test(u));
    expect(critical, `terceiros no caminho crítico: ${critical.join(', ')}`).toHaveLength(0);

    // O preview local do Worker entrega tudo sem compressão; a Cloudflare
    // comprime em produção e no preview do PR. O orçamento segue o que foi
    // de fato transferido, senão a mesma página reprova em uma máquina e
    // passa na outra.
    const orcamentoKB = comprimidas > 0 ? 450 : 950;
    expect(bytes / 1024, `${comprimidas > 0 ? 'comprimido' : 'sem compressão'}`).toBeLessThan(orcamentoKB);
  });

  // O HTML da edge traz os dados de hidratação num script inline. O que não
  // pode existir é 'unsafe-inline': cada script inline carrega o nonce da
  // resposta, e o mesmo nonce está no cabeçalho.
  test('todo script inline tem o nonce da CSP da resposta', async ({ page }) => {
    const res = await page.goto('/');
    const html = (await res?.text()) || '';
    const csp = res?.headers()['content-security-policy'] || '';

    const scriptSrc = csp.match(/script-src ([^;]*)/)?.[1] ?? '';
    expect(scriptSrc, `script-src: ${scriptSrc}`).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toMatch(/'nonce-[a-f0-9]+'/);
    const nonce = scriptSrc.match(/'nonce-([a-f0-9]+)'/)?.[1];

    const semNonce = (html.match(/<script(?![^>]*\ssrc=)[^>]*>/g) || [])
      .filter((tag) => !tag.includes(`nonce="${nonce}"`));
    expect(semNonce, `scripts inline sem nonce: ${semNonce.join(' ')}`).toHaveLength(0);

    expect(html).toContain('src="/boot.js"');
    const boot = await page.request.get('/boot.js');
    expect(boot.ok()).toBeTruthy();
  });

  test('formulário de contato tem telefone e e-mail clicáveis', async ({ page }) => {
    await page.goto('/contato');
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(page.locator('label[for="contact-email"]')).toBeVisible();
  });
});
