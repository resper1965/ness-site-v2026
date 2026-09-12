import { expect, test } from '@playwright/test';

/**
 * A prova da frente 2: a home da forense.io é servida sem JavaScript.
 * O que a página promete tem que sobreviver sem hidratação — por isso o
 * teste olha o conteúdo, não só a ausência de script.
 */
test.describe('rota sem JavaScript', () => {
  test('/forense não baixa nenhum módulo da aplicação', async ({ page }) => {
    const modulos: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.pathname.startsWith('/assets/') && url.pathname.endsWith('.js')) modulos.push(url.pathname);
    });
    await page.goto('/forense');
    await page.waitForLoadState('networkidle');
    expect(modulos, `módulos baixados: ${modulos.join(' ')}`).toEqual([]);
  });

  test('/forense mostra a cadeia de custódia com o JavaScript desligado', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/forense');
    await expect(pagina.locator('#cadeia')).toBeVisible();
    // Cinco etapas, e o mesmo hash em todas — é o que a página afirma.
    await expect(pagina.locator('#cadeia ol > li')).toHaveCount(5);
    const hashes = await pagina.locator('#cadeia code').allInnerTexts();
    expect(new Set(hashes.map((h) => h.trim())).size).toBe(1);
    await contexto.close();
  });
});
