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
  test('home não carrega terceiros no caminho crítico e pesa menos de 450 kB', async ({ page }) => {
    const external: string[] = [];
    let bytes = 0;
    page.on('response', async (res) => {
      const url = res.url();
      if (!url.startsWith('http://127.0.0.1') && !url.includes(process.env.SITE_BASE_URL || '127.0.0.1')) external.push(url);
      const len = Number(res.headers()['content-length'] || 0);
      bytes += len;
    });
    await page.goto('/', { waitUntil: 'load' });
    const critical = external.filter((u) => /unsplash|fonts\.googleapis|fonts\.gstatic|clearbit/.test(u));
    expect(critical, `terceiros no caminho crítico: ${critical.join(', ')}`).toHaveLength(0);
    expect(bytes).toBeLessThan(450 * 1024);
  });

  test('index.html não usa scripts inline (CSP sem unsafe-inline) e carrega /boot.js', async ({ page }) => {
    const res = await page.goto('/');
    const html = (await res?.text()) || '';
    const inline = html.match(/<script(?![^>]*\ssrc=)[^>]*>/g) || [];
    expect(inline, `scripts inline: ${inline.join(' ')}`).toHaveLength(0);
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
