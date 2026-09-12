/**
 * Reforço das rotas sem JavaScript (frente 2).
 *
 * O que a hidratação fazia e aqui continua: mandar evento de conversão para a
 * Zaraz e marcar a profundidade de rolagem. Nada mais — se este arquivo
 * crescer, a rota deixou de ser "sem JavaScript" e virou outra coisa.
 *
 * Mede menos de 1 KiB e é carregado com `defer`: nunca segura a pintura.
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

  // Profundidade de rolagem, uma vez por marca e por carregamento.
  var marcas = [25, 50, 75, 100];
  var vistas = {};
  var pendente = false;
  window.addEventListener(
    'scroll',
    function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () {
        pendente = false;
        var altura = document.documentElement.scrollHeight - window.innerHeight;
        if (altura <= 0) return;
        var pct = (window.scrollY / altura) * 100;
        for (var i = 0; i < marcas.length; i++) {
          var m = marcas[i];
          if (pct >= m && !vistas[m]) {
            vistas[m] = true;
            zaraz('scroll_depth', { profundidade: String(m) });
          }
        }
      });
    },
    { passive: true }
  );
})();
