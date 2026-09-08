import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

/**
 * Árvore de rotas do site, servida na edge.
 *
 * `lang` existe para a Onda 2.5 montar a mesma árvore sob /en e /es sem
 * duplicar nada — os ids precisam ser únicos por idioma, senão o React
 * Router recusa a configuração:
 *
 *   export default [...siteRoutes(), ...prefix('en', siteRoutes('en'))];
 */
function siteRoutes(lang = ''): RouteConfig {
  const id = (name: string) => (lang ? `${lang}/${name}` : name);

  return [
    // A home depende da marca: cada domínio recebe a sua.
    index('routes/home.tsx', { id: id('home') }),

    // Rotas que só existem na ness — nos outros domínios devolvem 404 real.
    layout('routes/somente-ness.tsx', { id: id('somente-ness') }, [
      route('solucoes', 'pages/Solutions.tsx', { id: id('solucoes') }),
      route('solucoes/:slug', 'pages/SolutionPage.tsx', { id: id('solucao') }),
      route('servicos', 'pages/Services.tsx', { id: id('servicos') }),
      route('verticais', 'pages/Verticals.tsx', { id: id('verticais') }),
    ]),

    // Páginas das sub-marcas, acessíveis a partir de qualquer domínio.
    route('trustness', 'pages/trustness/Home.tsx', { id: id('trustness') }),
    route('dpo-as-a-service', 'pages/trustness/DpoService.tsx', { id: id('dpo') }),
    route('forense', 'pages/forense/Home.tsx', { id: id('forense') }),

    // Comuns às três marcas. /contact, /about e /portfólio não estão aqui:
    // o Worker as redireciona com 301 para a grafia canônica.
    route('brandbook', 'pages/Brandbook.tsx', { id: id('brandbook') }),
    route('sobre', 'pages/About.tsx', { id: id('sobre') }),
    route('portfolio', 'pages/Portfolio.tsx', { id: id('portfolio') }),
    route('portfolio/:slug', 'pages/PortfolioCase.tsx', { id: id('portfolio-case') }),
    route('blog', 'pages/Blog.tsx', { id: id('blog') }),
    route('blog/:slug', 'pages/BlogPost.tsx', { id: id('blog-post') }),
    route('carreiras', 'pages/Careers.tsx', { id: id('carreiras') }),
    route('contato', 'pages/Contact.tsx', { id: id('contato') }),
    route('compliance/:type', 'pages/Compliance.tsx', { id: id('compliance') }),
    route('assessment/:type', 'pages/Assessment.tsx', { id: id('assessment') }),

    // Sem rota coringa: URL que não casa com nada é 404 de verdade, tratado
    // pelo ErrorBoundary da raiz. Uma rota `*` responderia 200 — soft-404.
  ];
}

export default siteRoutes() satisfies RouteConfig;
