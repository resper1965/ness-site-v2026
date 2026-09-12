import { expect, test } from '@playwright/test';

/**
 * A prova da frente 2: a home da forense.io é servida sem JavaScript.
 * O que a página promete tem que sobreviver sem hidratação — por isso o
 * teste olha o conteúdo, não só a ausência de script.
 */
test.describe('rota sem JavaScript', () => {
  test('/forense não baixa nenhum módulo da aplicação', async ({ page }) => {
    // Lista de permissão, não filtro por pasta: qualquer script, de qualquer
    // caminho, entra na conta. Só o reforço (frente 2, tarefa 2) tem passe.
    const scripts: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (req.resourceType() === 'script' || url.pathname.endsWith('.js')) scripts.push(url.pathname);
    });
    const resposta = await page.goto('/forense');
    await page.waitForLoadState('networkidle');
    // Sem isto um 500 ou uma resposta truncada passaria: zero scripts por
    // página quebrada, não por página sem JavaScript.
    expect(resposta?.status()).toBe(200);
    expect(new Set(scripts), `scripts carregados: ${scripts.join(' ')}`).toEqual(new Set(['/reforco.js']));
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
