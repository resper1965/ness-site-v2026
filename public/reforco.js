/**
 * Reforço das rotas sem JavaScript (frente 2).
 *
 * O que a hidratação fazia e aqui continua: mandar evento de conversão para a
 * Zaraz e marcar a profundidade de rolagem. Nada mais — se este arquivo
 * crescer, a rota deixou de ser "sem JavaScript" e virou outra coisa.
 *
 * Mede ~2,6 KiB (2624 bytes) — meça de novo com `wc -c public/reforco.js`
 * depois de qualquer edição deste arquivo, o número aqui é o que vale, não
 * o que a especificação registrou num dia diferente. O portão de verdade é
 * o `resource-summary:script:size` de 10 KiB em `lighthouserc.json`; este
 * comentário é só o alarme antecipado: se o arquivo crescer muito além do
 * que está medido aqui, a rota deixou de ser "sem JavaScript" e virou outra
 * coisa. Carregado com `defer`: nunca segura a pintura.
 */
(function () {
  var zaraz = function (nome, parametros) {
    if (window.zaraz && typeof window.zaraz.track === 'function') window.zaraz.track(nome, parametros || {});
  };

  // Evento por atributo: <a data-evento="cta_click" data-cta="hero"> vira
  // track('cta_click', { cta: 'hero' }). Delegação: um ouvinte para a página.
  document.addEventListener('click', function (e) {
    var alvo = e.target instanceof Element ? e.target.closest('[data-evento]') : null;
    if (!alvo) return;
    var parametros = {};
    for (var i = 0; i < alvo.attributes.length; i++) {
      var a = alvo.attributes[i];
      if (a.name.indexOf('data-') === 0 && a.name !== 'data-evento') parametros[a.name.slice(5)] = a.value;
    }
    zaraz(alvo.getAttribute('data-evento'), parametros);
  });

  // Profundidade de rolagem: mesmo campo, mesma fórmula e mesmos marcos de
  // src/components/ProfundidadeDeRolagem.tsx — os dois emitem `scroll_depth`,
  // e a linha do painel não pode variar conforme qual caminho rodou.
  var marcas = [25, 50, 75, 100];
  var vistas = {};
  var pendente = false;
  var medir = function () {
    pendente = false;
    var alturaVisivel = window.innerHeight;
    var alturaTotal = document.documentElement.scrollHeight;
    if (alturaTotal <= alturaVisivel) return;
    var lido = Math.round(((window.scrollY + alturaVisivel) / alturaTotal) * 100);
    for (var i = 0; i < marcas.length; i++) {
      var m = marcas[i];
      if (lido >= m && !vistas[m]) {
        vistas[m] = true;
        zaraz('scroll_depth', { percent: m, page: window.location.pathname });
      }
    }
  };
  medir();
  window.addEventListener(
    'scroll',
    function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(medir);
    },
    { passive: true }
  );
})();
