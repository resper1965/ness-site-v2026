/* Bootstrap síncrono e externo (a CSP não permite scripts inline).
   1) Preload da imagem do hero (candidata a LCP) só na home, por marca.
   2) gtag definido já, para enfileirar eventos; o SDK do GA4 é carregado
      após o `load`, em idle, para não competir com o conteúdo. */
(function () {
  if (location.pathname === '/') {
    var h = location.hostname;
    var b = h.indexOf('trustness') > -1 ? 'trustness' : h.indexOf('forense') > -1 ? 'forense' : 'ness';
    var l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'image';
    l.type = 'image/avif';
    l.fetchPriority = 'high';
    l.imageSrcset = '/img/hero-' + b + '-640.avif 640w, /img/hero-' + b + '-1024.avif 1024w, /img/hero-' + b + '-1600.avif 1600w';
    l.imageSizes = '100vw';
    document.head.appendChild(l);
  }

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
