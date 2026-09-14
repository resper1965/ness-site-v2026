import { test, expect } from '@playwright/test';

/**
 * Os portões do movimento (docs/PLAN-movimento.md, seção 8): a página nunca
 * depende do movimento para existir, nada se mexe sozinho, e nenhuma
 * animação empurra a página para o lado no celular.
 */

const ROTAS = ['/', '/solucoes', '/solucoes/secops', '/forense', '/trustness'];

test.describe('movimento', () => {
  // A regra de preferência é positiva: toda entrada vive dentro de
  // `prefers-reduced-motion: no-preference`. Com a preferência ligada, não
  // pode haver animação nenhuma, e todo texto tem que estar visível.
  test('com reduced-motion nada anima e todo o conteúdo está visível', async ({ browser }) => {
    const contexto = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await contexto.newPage();
    for (const rota of ROTAS) {
      await page.goto(rota);
      await page.waitForLoadState('networkidle');
      const resultado = await page.evaluate(() => {
        const animacoes = document.getAnimations().filter((a) => {
          const alvo = (a.effect as KeyframeEffect | null)?.target as Element | null;
          // O skeleton do blog (animate-pulse) e o spinner são do Tailwind,
          // e ficam fora: o que se mede é a camada de movimento.
          return alvo && !alvo.className.toString().includes('animate-');
        });
        const escondidos = [...document.querySelectorAll('h1, h2, h3, p, li, a')].filter((el) => {
          const estilo = getComputedStyle(el);
          return estilo.opacity !== '1' && el.closest('main') && !el.closest('[aria-hidden="true"]');
        });
        return { animacoes: animacoes.length, escondidos: escondidos.map((el) => el.textContent?.slice(0, 40)) };
      });
      expect(resultado.animacoes, `${rota}: animações com reduced-motion`).toBe(0);
      expect(resultado.escondidos, `${rota}: conteúdo escondido com reduced-motion`).toEqual([]);
    }
    await contexto.close();
  });

  // O HTML do servidor, que o buscador e quem não tem JavaScript leem, sai
  // completo: nenhum estado escondido inline.
  test('o HTML do servidor não esconde conteúdo', async ({ request }) => {
    for (const rota of ROTAS) {
      const html = await (await request.get(rota)).text();
      expect(html, `${rota} com opacity:0 inline`).not.toMatch(/style="[^"]*opacity:\s*0[^.]/);
      expect(html, `${rota} com visibility:hidden inline`).not.toMatch(/style="[^"]*visibility:\s*hidden/);
    }
  });

  // "Nada se mexe sozinho": 1,5 s depois do load, com a página parada, não
  // pode haver animação em curso. As guiadas por rolagem ficam pausadas
  // enquanto ninguém rola; as de entrada já terminaram.
  test('nada se mexe sozinho depois da entrada', async ({ page }) => {
    for (const rota of ROTAS) {
      await page.goto(rota);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1_800);
      const emCurso = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === 'running' && !(a.timeline && 'axis' in a.timeline))
          .filter((a) => {
            const alvo = (a.effect as KeyframeEffect | null)?.target as Element | null;
            return alvo && !alvo.className.toString().includes('animate-');
          })
          .map((a) => ((a.effect as KeyframeEffect | null)?.target as Element | null)?.className),
      );
      expect(emCurso, `${rota}: animações em curso com a página parada`).toEqual([]);
    }
  });

  // Depois de rolar até o fim, tudo o que se revela está revelado, e nada
  // empurrou a página para o lado.
  test('ao fim da rolagem tudo está revelado e nada rola para o lado', async ({ page }) => {
    for (const rota of ROTAS) {
      await page.goto(rota);
      await page.waitForLoadState('networkidle');
      // A abertura leva até 1,5 s para se compor; só depois dela a rolagem
      // começa, em passos, como uma pessoa, para as animações guiadas por
      // rolagem percorrerem o caminho.
      await page.waitForTimeout(1_800);
      await page.evaluate(async () => {
        const passo = window.innerHeight / 2;
        for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
          window.scrollTo(0, y);
          await new Promise((r) => requestAnimationFrame(() => r(null)));
        }
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      });
      const resultado = await page.evaluate(() => ({
        largura: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        opacos: [...document.querySelectorAll('.revela, .entra')].filter((el) => getComputedStyle(el).opacity !== '1').length,
      }));
      expect(resultado.largura, `${rota}: rolagem lateral`).toBe(true);
      expect(resultado.opacos, `${rota}: elementos ainda escondidos ao fim da rolagem`).toBe(0);
    }
  });

  // A abertura se compõe: o ponto azul pousa por último e a sequência
  // inteira termina em menos de 1,5 s.
  test('a abertura se compõe em menos de 1,5 s', async ({ page }) => {
    await page.goto('/');
    const inicio = Date.now();
    const ponto = page.locator('h1 .pousa').first();
    await expect(ponto).toBeVisible();
    await expect.poll(async () => ponto.evaluate((el) => getComputedStyle(el).opacity), { timeout: 3_000 }).toBe('1');
    expect(Date.now() - inicio).toBeLessThan(2_500);
    const palavras = await page.locator('h1 .palavra').count();
    expect(palavras).toBeGreaterThan(3);
  });

  // A luz que segue o leitor (M4): só com ponteiro fino e sem reduced-motion.
  // O script inline cabe no portão de 5 KiB do reforço.
  test('a luz da abertura segue o ponteiro no desktop e fica parada no resto', async ({ page, browser, isMobile, request }) => {
    const html = await (await request.get('/')).text();
    const inline = html.match(/<script nonce="[^"]*">([^<]*data-luz[^<]*)<\/script>/);
    expect(inline, 'o script da luz sai inline no HTML do servidor').not.toBeNull();
    expect(Buffer.byteLength(inline![1]), 'o script da luz passa de 5 KiB').toBeLessThan(5 * 1024);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const luz = page.locator('section[data-luz]').first();
    const caixa = (await luz.boundingBox())!;
    await page.mouse.move(caixa.x + caixa.width * 0.2, caixa.y + caixa.height * 0.7, { steps: 8 });
    const centro = () => luz.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--mx'));
    if (isMobile) {
      await page.waitForTimeout(400);
      expect(await centro(), 'no celular a luz fica onde está').toBe('');
    } else {
      await expect.poll(centro, { timeout: 3_000 }).toMatch(/^\d/);
      expect(parseFloat(await centro()), 'a luz foi para a esquerda, atrás do ponteiro').toBeLessThan(50);
      // Ao sair da abertura, a luz volta para o centro devagar.
      await page.mouse.move(caixa.x + caixa.width * 0.5, caixa.y + caixa.height + 200, { steps: 8 });
      await expect.poll(async () => Math.abs(parseFloat(await centro()) - 50), { timeout: 4_000 }).toBeLessThan(1);
    }

    const contexto = await browser.newContext({ reducedMotion: 'reduce' });
    const quieta = await contexto.newPage();
    await quieta.goto('/');
    await quieta.waitForLoadState('networkidle');
    const alvo = quieta.locator('section[data-luz]').first();
    const b = (await alvo.boundingBox())!;
    await quieta.mouse.move(b.x + b.width * 0.2, b.y + b.height * 0.7, { steps: 8 });
    await quieta.waitForTimeout(400);
    expect(await alvo.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--mx')), 'com reduced-motion a luz não segue').toBe('');
    await contexto.close();
  });

  // C3 e C4: cinco glifos no ciclo, seis marcas na faixa, e nenhum deles
  // vira texto para o leitor de tela.
  test('o ciclo tem cinco glifos e a faixa tem seis marcas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#soluções figure svg.glifo[aria-hidden="true"]')).toHaveCount(5);
    await expect(page.locator('.faixa-grade > li')).toHaveCount(6);
  });
});
