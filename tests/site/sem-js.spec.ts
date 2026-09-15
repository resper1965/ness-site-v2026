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

/**
 * O que a prova custou, e passou a não custar mais.
 *
 * A revisão do PR listou três buracos que a rota sem hidratação abria: no
 * celular ela ficava sem navegação, a troca de idioma não respondia e a faixa
 * de consentimento nunca aparecia — e, sem ela, a medição que o reforço existe
 * para repor nunca era autorizada. Os três viraram HTML: `<details>` para os
 * menus, links para o idioma, formulário para o consentimento.
 *
 * Todo teste daqui roda com `javaScriptEnabled: false`. É a única forma de
 * provar que não sobrou um `onClick` no caminho.
 */
test.describe('a /forense navega sem JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test('o menu do celular abre, lista as páginas e leva a outra', async ({ page }) => {
    await page.goto('/forense');

    const menu = page.locator('details#mobile-menu, details:has(#mobile-menu)').first();
    const painel = page.locator('#mobile-menu');
    await expect(painel).toBeHidden();

    // Abrir é um clique no <summary>: o navegador faz sozinho.
    await menu.locator('summary').click();
    await expect(painel).toBeVisible();

    const sobre = painel.getByRole('link', { name: /sobre|about/i }).first();
    await expect(sobre).toBeVisible();
    await sobre.click();
    await expect(page).toHaveURL(/\/sobre$/);
  });

  test('a troca de idioma é um link, e leva à mesma página traduzida', async ({ page }) => {
    await page.goto('/forense');
    await page.locator('details:has(#mobile-menu) summary').click();
    const ingles = page.locator('#mobile-menu a[hreflang="en"]');
    await expect(ingles).toHaveAttribute('href', '/en/forense');
    await ingles.click();
    await expect(page).toHaveURL(/\/en\/forense$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('o aviso de privacidade aparece, responde e não volta', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/forense');

    const aviso = page.getByRole('region', { name: /privacidade|privacy/i });
    await expect(aviso).toBeVisible();

    // Recusar é enviar um formulário: o Worker grava a escolha e devolve a
    // pessoa para a mesma página. Sem JavaScript não há outro caminho.
    await aviso.getByRole('button', { name: /recusar|decline|rechazar/i }).click();
    await expect(page).toHaveURL(/\/forense$/);
    await expect(aviso).toBeHidden();

    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'ness-consent')?.value).toBe('recusado');

    // E não volta na próxima página, que é o ponto do cookie.
    await page.goto('/forense');
    await expect(aviso).toBeHidden();
  });

  test('a resposta ao aviso não leva ninguém para fora do site', async ({ page }) => {
    // O formulário é público: um `volta` apontando para outro domínio viraria
    // um redirecionador aberto com o nosso nome.
    const resposta = await page.request.post('/consentimento', {
      form: { resposta: 'aceito', volta: '//exemplo.invalido/' },
      maxRedirects: 0,
    });
    expect(resposta.status()).toBe(303);
    expect(resposta.headers()['location']).toBe('/');
  });
});

/**
 * O evento de conversão na rota sem hidratação.
 *
 * O `onClick` do CTA da navbar nunca liga aqui, e o reforço só enxerga quem
 * carrega `data-evento`: sem esses atributos, a conversão mais visível da
 * página deixava de ser contada — achado do Codex na revisão deste PR. O
 * teste roda com JavaScript ligado, porque é o reforço que está sendo
 * medido, e ele é JavaScript.
 */
test.describe('a medição da /forense sem hidratação', () => {
  test('o CTA da navbar emite cta_click com cta e destino', async ({ page }) => {
    // Os eventos vão para o sessionStorage porque o clique navega: uma
    // variável em `window` iria embora com o documento antes de ser lida.
    await page.addInitScript(`
      window.zaraz = {
        track: (nome, parametros) => {
          const ate_agora = JSON.parse(sessionStorage.getItem('__eventos') || '[]');
          ate_agora.push([nome, parametros]);
          sessionStorage.setItem('__eventos', JSON.stringify(ate_agora));
        },
      };
    `);
    await page.goto('/forense');
    await page.locator('nav a[data-evento="cta_click"][data-cta="navbar"]').click();
    await expect(page).toHaveURL(/\/contato$/);

    const eventos: [string, Record<string, string>][] = JSON.parse(
      (await page.evaluate(() => sessionStorage.getItem('__eventos'))) ?? '[]',
    );
    const conversao = eventos.find(([nome]) => nome === 'cta_click');
    expect(conversao, `eventos: ${JSON.stringify(eventos)}`).toBeTruthy();
    // Os mesmos campos que o `onClick` emitiria na rota hidratada, e só
    // eles: `data-discover`, que o React Router põe em todo <Link>, não pode
    // virar campo do painel.
    expect(conversao?.[1]).toEqual({ cta: 'navbar', destino: '/contato' });
  });
});
