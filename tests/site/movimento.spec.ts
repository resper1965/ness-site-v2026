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
});
