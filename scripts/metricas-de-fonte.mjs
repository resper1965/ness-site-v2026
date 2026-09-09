/**
 * Deriva os valores de `size-adjust`, `ascent-override` e `descent-override`
 * do fallback métrico, medindo a fonte real contra a Arial (Liberation Sans,
 * que tem as mesmas larguras de avanço) no próprio navegador.
 *
 * Uso: subir o preview e rodar `node scripts/metricas-de-fonte.mjs`.
 * Os números entram no @font-face "… Fallback" em src/index.css.
 */
import { chromium } from '@playwright/test';
const nav = await chromium.launch();
const p = await (await nav.newContext()).newPage();
await p.goto('http://127.0.0.1:4211/', { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
const r = await p.evaluate(() => {
  const c = document.createElement('canvas').getContext('2d');
  const frase = 'operações de segurança 24×7 e perícia digital — ness.';
  const ler = (fam) => {
    c.font = `100px ${fam}`;
    const m = c.measureText(frase);
    return {
      largura: m.width,
      ascent: c.measureText('Hxg').fontBoundingBoxAscent,
      descent: c.measureText('Hxg').fontBoundingBoxDescent,
    };
  };
  return { real: ler('"Montserrat"'), cru: ler('"Liberation Sans"') };
});
const sizeAdjust = r.real.largura / r.cru.largura;
console.log(JSON.stringify(r, null, 1));
console.log('size-adjust:      ', (sizeAdjust * 100).toFixed(1) + '%');
console.log('ascent-override:  ', ((r.real.ascent / 100) / sizeAdjust * 100).toFixed(1) + '%');
console.log('descent-override: ', ((r.real.descent / 100) / sizeAdjust * 100).toFixed(1) + '%');
await nav.close();
