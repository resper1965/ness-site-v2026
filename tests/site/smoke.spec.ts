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

  test('slug de solução inexistente renderiza 404 com noindex', async ({ page }) => {
    await page.goto('/solucoes/devsecops');
    await expect(page.locator('h1')).toContainText('página não encontrada');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
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
