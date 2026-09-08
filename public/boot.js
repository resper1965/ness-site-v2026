/* Fila do gtag, em arquivo externo porque a CSP não permite script inline.
   Carregado com `defer`: nada aqui precisa rodar antes da página aparecer.
   O preload do hero saiu daqui — agora sai no HTML do servidor, onde o
   preload scanner o encontra sem esperar este download. */
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // page_view inicial automático; navegações da SPA são enviadas pelo app (Analytics.tsx)
  window.gtag('config', 'G-H181SG5HQT');

  var loadGa = function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-H181SG5HQT';
    document.head.appendChild(s);
  };
  addEventListener('load', function () {
    if ('requestIdleCallback' in window) requestIdleCallback(loadGa, { timeout: 4000 });
    else setTimeout(loadGa, 1500);
  });
})();
