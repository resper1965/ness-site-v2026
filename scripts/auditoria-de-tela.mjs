/**
 * Auditoria de tela — roda contra um preview ou contra produção.
 *
 * Confere, em cada rota e em dois tamanhos, o que quebra silenciosamente e
 * não aparece em teste de unidade: imagem sem alt, campo sem rótulo, controle
 * sem nome acessível, alvo de toque abaixo de 24 px, salto de nível de
 * título, rolagem horizontal e peso 700 (que não existe na escala da marca).
 *
 * Uso:
 *   node scripts/auditoria-de-tela.mjs https://ness-site2026-pr-34.ness.workers.dev
 *   node scripts/auditoria-de-tela.mjs http://127.0.0.1:4351
 *
 * Saída vazia significa nenhum achado. Foi assim que apareceram, todos já em
 * produção: 64 px de rolagem lateral nos três domínios (o widget do Turnstile
 * no rodapé), /solucoes sem h1, e o portfólio buscando avatar num terceiro
 * com o nome do cliente na URL.
 */
import { chromium } from '@playwright/test';

const BASE = process.argv[2];
if (!BASE) {
  console.error('uso: node scripts/auditoria-de-tela.mjs <url-base>');
  process.exit(1);
}

const ROTAS = [
  '/',
  '/solucoes',
  '/solucoes/secops',
  '/contato',
  '/sobre',
  '/carreiras',
  '/portfolio',
  '/brandbook',
  '/compliance/privacidade',
];

const auditar = () => {
  const achados = [];
  const visivel = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return (
      r.width > 0 &&
      r.height > 0 &&
      s.visibility !== 'hidden' &&
      s.display !== 'none' &&
      // sr-only: recortado até receber foco, quando vira alvo de verdade
      s.clipPath === 'none' &&
      s.clip === 'auto'
    );
  };
  const nomeDe = (el) => (el.getAttribute('aria-label') || el.textContent || '').trim();

  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) achados.push(['imagem sem alt', img.getAttribute('src') || '(sem src)']);
  }

  for (const el of document.querySelectorAll('button, a[href], [role="button"]')) {
    if (visivel(el) && !nomeDe(el) && !el.getAttribute('aria-labelledby')) {
      achados.push(['controle sem nome', el.tagName]);
    }
  }

  for (const el of document.querySelectorAll('input, textarea, select')) {
    if (el.type === 'hidden' || !visivel(el)) continue;
    const temLabel = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (!temLabel && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      achados.push(['campo sem rótulo', el.name || el.type]);
    }
  }

  for (const el of document.querySelectorAll('button, a[href], input[type="checkbox"], [role="button"]')) {
    // link dentro de frase é a exceção que a própria norma dá (WCAG 2.5.8)
    if (!visivel(el) || el.closest('label')) continue;
    const r = el.getBoundingClientRect();
    if (Math.min(r.width, r.height) < 24) {
      achados.push(['alvo abaixo de 24 px', `${Math.round(r.width)}x${Math.round(r.height)} ${nomeDe(el).slice(0, 30)}`]);
    }
  }

  const niveis = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visivel).map((h) => +h.tagName[1]);
  const quantosH1 = niveis.filter((n) => n === 1).length;
  if (quantosH1 !== 1) achados.push(['h1 fora do esperado', String(quantosH1)]);
  for (let i = 1; i < niveis.length; i++) {
    if (niveis[i] - niveis[i - 1] > 1) achados.push(['salto de título', `h${niveis[i - 1]} → h${niveis[i]}`]);
  }

  window.scrollTo(3000, 0);
  const rolou = window.scrollX;
  window.scrollTo(0, 0);
  if (rolou > 0) achados.push(['rolagem horizontal', `${rolou}px`]);

  const pesados = [...document.querySelectorAll('body *')].filter(
    (el) => visivel(el) && Number(getComputedStyle(el).fontWeight) >= 700 && el.textContent.trim() && !el.children.length,
  );
  if (pesados.length) {
    achados.push(['peso 700', `${pesados.length}× — ex.: ${pesados[0].textContent.trim().slice(0, 30)}`]);
  }

  return achados;
};

const nav = await chromium.launch();
let total = 0;

for (const [largura, altura, rotulo] of [[390, 844, 'mobile'], [1440, 900, 'desktop']]) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: altura }, locale: 'pt-BR' });
  for (const rota of ROTAS) {
    const pagina = await ctx.newPage();
    try {
      const resposta = await pagina.goto(BASE + rota, { waitUntil: 'load', timeout: 30_000 });
      await pagina.evaluate(() => document.fonts.ready);
      await pagina.waitForTimeout(2200);
      const achados = await pagina.evaluate(auditar);
      const status = resposta.status();
      if (achados.length || status !== 200) {
        total += achados.length;
        console.log(`\n${rotulo} ${rota}${status !== 200 ? `  [HTTP ${status}]` : ''}`);
        const porTipo = {};
        for (const [tipo, detalhe] of achados) (porTipo[tipo] ||= []).push(detalhe);
        for (const [tipo, lista] of Object.entries(porTipo)) {
          console.log(`   ${tipo} (${lista.length}): ${[...new Set(lista)].slice(0, 4).join(' | ')}`);
        }
      }
    } catch (erro) {
      total += 1;
      console.log(`\n${rotulo} ${rota}  ERRO: ${erro.message.slice(0, 90)}`);
    }
    await pagina.close();
  }
  await ctx.close();
}

await nav.close();
console.log(total === 0 ? '\nnenhum achado.' : `\n${total} achado(s).`);
process.exit(total === 0 ? 0 : 1);
