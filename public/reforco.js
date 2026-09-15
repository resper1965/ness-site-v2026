/**
 * Reforço das rotas sem JavaScript (frente 2).
 *
 * O que a hidratação fazia e aqui continua: mandar evento de conversão para a
 * Zaraz, marcar a profundidade de rolagem e levar até a medição a resposta que
 * a pessoa deu ao aviso de privacidade. Nada mais — se este arquivo crescer,
 * a rota deixou de ser "sem JavaScript" e virou outra coisa.
 *
 * Mede ~3,9 KiB (4015 bytes) — meça de novo com `wc -c public/reforco.js`
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

  // A resposta ao aviso de privacidade chega pelo cookie que o Worker grava:
  // aqui não há hidratação, então aceitar é enviar um formulário e voltar. É
  // este trecho que leva a escolha até a medição — sem ele, o visitante
  // responde e nada acontece, que era o buraco desta rota.
  var aplicarEscolha = function (aceitou) {
    try {
      var consent = window.zaraz && window.zaraz.consent;
      if (!consent) return;
      if (typeof consent.setAll === 'function') consent.setAll(aceitou);
      if (aceitou && typeof consent.sendQueuedEvents === 'function') consent.sendQueuedEvents();
    } catch (e) {
      // Terceiro quebrou. A página segue.
    }
  };
  var respondido = /(?:^|;\s*)ness-consent=(aceito|recusado)(?:;|$)/.exec(document.cookie);
  if (respondido) {
    var aceitou = respondido[1] === 'aceito';
    // A API pode estar pronta agora ou chegar depois; os dois casos contam.
    document.addEventListener('zarazConsentAPIReady', function () { aplicarEscolha(aceitou); });
    aplicarEscolha(aceitou);
  }

  // Evento por atributo: <a data-evento="cta_click" data-cta="hero"> vira
  // track('cta_click', { cta: 'hero' }). Delegação: um ouvinte para a página.
  //
  // `data-discover` fica de fora: quem o põe é o React Router, em todo
  // <Link>, e ele viraria um campo `discover: "true"` em cada evento — ruído
  // nosso no painel de quem lê a conversão.
  var IGNORADOS = { 'data-evento': 1, 'data-discover': 1 };
  document.addEventListener('click', function (e) {
    var alvo = e.target instanceof Element ? e.target.closest('[data-evento]') : null;
    if (!alvo) return;
    var parametros = {};
    for (var i = 0; i < alvo.attributes.length; i++) {
      var a = alvo.attributes[i];
      if (a.name.indexOf('data-') === 0 && !IGNORADOS[a.name]) parametros[a.name.slice(5)] = a.value;
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
