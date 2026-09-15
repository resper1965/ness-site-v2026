/**
 * A luz que segue o leitor (docs/PLAN-movimento.md, 4.9 / M4).
 *
 * O brilho da abertura lê o seu centro de `--mx`/`--my` no `section[data-luz]`.
 * Este script, servido inline no HTML do servidor com o nonce da CSP, move as
 * duas variáveis atrás do ponteiro com atraso: interpolação linear a cada
 * quadro, e o laço para sozinho quando chega (nada se mexe sozinho). Quando o
 * ponteiro sai da abertura, a luz volta devagar para o centro. É a única
 * exceção à regra "tudo em CSS", e por isso mora aqui, sozinha, em menos de
 * 1 KiB.
 *
 * Só com ponteiro fino e hover de verdade, e só sem `prefers-reduced-motion`.
 * No celular, sem JavaScript, ou com a preferência ligada, a luz fica onde
 * sempre esteve. Os ouvintes ficam no documento, e o `section` é procurado a
 * cada evento: assim a luz continua funcionando depois de uma navegação
 * interna, quando a abertura é outro elemento.
 */
export const LUZ_QUE_SEGUE = [
  "(()=>{var m=matchMedia;if(!m('(hover:hover) and (pointer:fine)').matches||!m('(prefers-reduced-motion:no-preference)').matches)return;",
  'var s=null,cx=.5,cy=.45,tx=cx,ty=cy,x=cx,y=cy,r=0;',
  "function q(){if(!s)return;x+=(tx-x)*.08;y+=(ty-y)*.08;s.style.setProperty('--mx',(x*100).toFixed(2)+'%');s.style.setProperty('--my',(y*100).toFixed(2)+'%');if(Math.abs(tx-x)+Math.abs(ty-y)>.001)requestAnimationFrame(q);else r=0}",
  'function a(){if(!r){r=1;requestAnimationFrame(q)}}',
  'function volta(){tx=cx;ty=cy;a()}',
  "document.addEventListener('pointermove',function(e){var t=e.target&&e.target.closest?e.target.closest('[data-luz]'):null;if(!t){if(s)volta();return}if(t!==s){s=t;x=cx;y=cy}var b=s.getBoundingClientRect();tx=(e.clientX-b.left)/b.width;ty=(e.clientY-b.top)/b.height;a()},{passive:true});",
  "document.addEventListener('pointerleave',volta,{passive:true})})();",
].join('');
