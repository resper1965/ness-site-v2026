import BlueDot, { NomeDeProduto } from '../components/BlueDot';
import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";

import { useBrand } from '../config/brand';
import { useFechaSozinho } from '../utils/menu';
import { rotaNoIdioma, type Idioma } from '../utils/lang';
import { solutionsData } from '../data/solutionsData';
import { evento } from '../utils/eventos';
import EcosystemSwitcher from './EcosystemSwitcher';

/** Os cinco produtos, lidos de solutionsData: uma fonte da verdade só. */
const SOLUCOES = Object.entries(solutionsData).map(([slug, dados]) => {
  const [nome, resumo] = (dados.metaTitle ?? slug).split(' — ');
  return { slug, nome: nome ?? slug, resumo: resumo ?? '' };
});

const Navbar = () => {
  const BRAND = useBrand();
  const { t, i18n } = useTranslation();
  const location = useLocation();


  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Only solutions differ per brand — all other pages are shared
  const nessOnlyKeys = ['solutions'];
  const trustnessOnlyKeys = ['dpo'];

  const allMenuItems = [
    { key: "solutions", label: t("nav.solutions"), to: "/solucoes" },
    { key: "dpo", label: "DPO as a Service", to: "/dpo-as-a-service" },
    { key: "sobre", label: t("nav.about"), to: "/sobre" },
    { key: "portfolio", label: t("nav.portfolio"), to: "/portfolio" },
    { key: "blog", label: t("nav.blog"), to: "/blog" },
    { key: "carreiras", label: t("nav.careers"), to: "/carreiras" },
    { key: "contato", label: t("nav.contact"), to: "/contato" }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (BRAND === 'ness') return !trustnessOnlyKeys.includes(item.key);
    if (BRAND === 'trustness') return !nessOnlyKeys.includes(item.key);
    // forense: hide both ness-only and trustness-only
    return !nessOnlyKeys.includes(item.key) && !trustnessOnlyKeys.includes(item.key);
  });

  // Os dois menus da navbar são <details>: quem abre e fecha é o navegador,
  // não um estado do React. É isso que os mantém de pé na rota servida sem
  // hidratação — e, de quebra, tirou daqui três efeitos e dois estados.
  const caixaSolucoes = useRef<HTMLDetailsElement>(null);
  const menuMobile = useRef<HTMLDetailsElement>(null);
  useFechaSozinho(caixaSolucoes);
  useFechaSozinho(menuMobile);

  /** O endereço da página no idioma pedido, preservando a consulta. */
  const rotaDoIdioma = (lng: string) => rotaNoIdioma(location.pathname, lng as Idioma) + location.search;

  // Navegou, fecha os dois. Sem JavaScript a navegação recarrega o documento
  // e o <details> volta fechado sozinho; com JavaScript a troca é no cliente
  // e o painel ficaria aberto sobre a página nova.
  useEffect(() => {
    for (const menu of [caixaSolucoes.current, menuMobile.current]) {
      if (menu) menu.open = false;
    }
  }, [location.pathname]);

  const brandMark = (BRAND === 'trustness' || location.pathname === '/trustness')
    ? <>trustness<BlueDot /></>
    : (BRAND === 'forense' || location.pathname === '/forense')
      ? <>forense<BlueDot />io</>
      : <>ness<BlueDot /></>;

  return (
    <>
      <nav aria-label={t('a11y.nav_main', 'principal')} className="navbar fixed top-3 md:top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass rounded-full flex justify-between items-center px-5 md:px-8 py-2.5 md:py-3 z-50 nebula-shadow">
        {/* Ao rolar 80 px a marca encolhe a 92 % e a pílula fica mais opaca (CSS guiado pela rolagem) */}
        <Link to="/" viewTransition className="marca navbar-marca inline-block text-2xl text-white">
          {brandMark}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {/* No lugar do selo de longevidade: ele dizia uma coisa só e não
              levava a lugar nenhum. O tempo de casa segue no hero e no sobre. */}
          <div className="hidden lg:block">
            <EcosystemSwitcher />
          </div>
          {/* "contato" sai da fileira: o botão de ação ao lado já leva lá, e
              repetir o mesmo destino a três centímetros só divide a atenção.
              No menu mobile ele continua, porque lá o botão não está à vista. */}
          {menuItems.filter((item) => item.key !== 'contato').map((item) => {
            const active = isActive(item.to);

            // Soluções abre o mapa das cinco: o visitante que chega por
            // "segurança" não sabe que o produto se chama n.secops.
            if (item.key === 'solutions') {
              return (
                <details key={item.key} ref={caixaSolucoes} className="abre-fecha group relative">
                  <summary
                    /* Só clique: abrir no hover e fechar no clique é o padrão
                       que confunde no mouse e não existe no toque. */
                    className={`nav-link flex items-center gap-1 py-2 tracking-wide text-[11px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm ${
                      active ? 'text-primary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={12} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                  </summary>

                    <div
                      id="menu-solucoes"
                      /* Sobe 8 px e aparece com @starting-style; fechar é imediato */
                      className="nasce absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[320px]"
                    >
                      <div className="bg-surface-container-low/98 backdrop-blur-xl rounded-3xl border border-white/10 p-3 nebula-shadow">
                        {SOLUCOES.map((solucao) => (
                          <Link
                            key={solucao.slug}
                            to={`/solucoes/${solucao.slug}`}
                            viewTransition
                            className="block px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-colors"
                          >
                            <span className="marca block text-sm text-white">
                              <NomeDeProduto nome={solucao.nome} />
                            </span>
                            <span className="block text-[11px] text-on-surface-variant leading-snug">{solucao.resumo}</span>
                          </Link>
                        ))}
                        {/* Serviços e verticais viraram o mapa de soluções. */}
                        <Link
                          to="/solucoes"
                          viewTransition
                          className="block mt-1 pt-2.5 pb-2 px-4 border-t border-white/10 text-[11px] text-on-surface-variant hover:text-white transition-colors"
                        >
                          {t('solutions.ciclo.ver_mapa', 'ver o mapa das soluções')}
                        </Link>

                        <Link
                          to="/assessment/cyber"
                          onClick={() => evento('cta_click', { cta: 'megamenu_diagnostico', destino: '/assessment/cyber' })}
                          data-evento="cta_click"
                          data-cta="megamenu_diagnostico"
                          data-destino="/assessment/cyber"
                          className="block mt-1 px-4 py-2.5 rounded-2xl bg-primary-container/10 text-primary-container text-[11px] font-medium uppercase tracking-widest text-center hover:bg-primary-container hover:text-on-primary transition-colors"
                        >
                          {t('nav.assessment', 'diagnóstico gratuito')}
                        </Link>
                      </div>
                    </div>
                </details>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.to}
                viewTransition
                aria-current={active ? 'page' : undefined}
                className={`nav-link inline-flex items-center py-2 tracking-wide text-[11px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-medium focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm ${
                  active ? "text-primary-container" : "text-on-surface-variant"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          {/* O idioma vive na URL, então trocar de idioma é seguir um link:
              funciona sem JavaScript, dá para abrir em outra aba e o
              buscador enxerga as três versões da página. */}
          <div className="hidden sm:flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            {['pt', 'en', 'es'].map((lng) => (
              <Link
                key={lng}
                to={rotaDoIdioma(lng)}
                hrefLang={lng}
                aria-label={t('a11y.change_language', { idioma: lng.toUpperCase(), defaultValue: 'mudar o idioma para {{idioma}}' })}
                aria-current={i18n.language.startsWith(lng) ? 'true' : undefined}
                className={`px-3 py-2 rounded-full text-[11px] uppercase font-medium tracking-wide transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
                  i18n.language.startsWith(lng)
                    ? "bg-primary-container text-on-primary"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {lng}
              </Link>
            ))}
          </div>

          {/* CTA — visível também no mobile.

              Os `data-evento` ao lado do `onClick` não são repetição: na rota
              servida sem hidratação o `onClick` nunca liga, e é o reforço
              estático que emite o evento, lendo estes atributos. Sem eles a
              conversão mais visível da página não era contada (achado do
              Codex). Com hidratação quem emite é o `onClick`, uma vez só —
              o reforço não é carregado ali. */}
          <Link
            onClick={() => evento('cta_click', { cta: 'navbar', destino: '/contato' })}
            to="/contato"
            data-evento="cta_click"
            data-cta="navbar"
            data-destino="/contato"
            viewTransition
            className="bg-primary-container text-on-primary px-4 md:px-6 py-2 rounded-full font-display font-medium text-[11px] md:text-xs uppercase tracking-wide transition-all hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-container whitespace-nowrap"
          >
            {t('nav.contact')}
          </Link>

          {/* O menu do celular. Um <details> e não um botão com estado: ele
              abre, fecha e navega sem uma linha de JavaScript, que é o que
              mantém navegável a rota servida sem o runtime. O painel desce
              ancorado à pílula — dentro dela, porque o vidro da navbar
              (backdrop-filter) prende qualquer descendente fixo. */}
          <details ref={menuMobile} className="abre-fecha group md:hidden">
            <summary
              aria-label={t('a11y.menu', 'menu de navegação')}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            >
              <Menu size={24} aria-hidden="true" className="group-open:hidden" />
              <X size={24} aria-hidden="true" className="hidden group-open:block" />
            </summary>

            <div
              id="mobile-menu"
              /* Aparece sem sair do lugar: a folha é grande, e um alvo que
                 desliza é um alvo que escapa de quem toca depressa. */
              className="surge absolute inset-x-0 top-full mt-3 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-white/10 bg-surface-container-low/98 p-6 backdrop-blur-xl nebula-shadow"
            >
              <div className="flex flex-col gap-6">
                {/* Trocar de idioma é seguir um link, também aqui. */}
                <div className="flex flex-wrap items-center gap-3">
                  {['pt', 'en', 'es'].map((lng) => (
                    <Link
                      key={lng}
                      to={rotaDoIdioma(lng)}
                      hrefLang={lng}
                      aria-current={i18n.language.startsWith(lng) ? 'true' : undefined}
                      className={`px-5 py-3 rounded-full text-xs uppercase font-medium tracking-wide transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
                        i18n.language.startsWith(lng)
                          ? "bg-primary-container text-on-primary"
                          : "bg-white/5 text-on-surface-variant"
                      }`}
                    >
                      <span lang={lng}>{lng === 'pt' ? 'Português' : lng === 'en' ? 'English' : 'Español'}</span>
                    </Link>
                  ))}
                </div>

                {menuItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <div key={item.key}>
                      <Link
                        to={item.to}
                        viewTransition
                        aria-current={active ? 'page' : undefined}
                        className={`font-display text-2xl font-semibold lowercase-all tracking-tighter ${
                          active ? "text-primary-container" : "text-white"
                        }`}
                      >
                        {item.label}{active && <BlueDot />}
                      </Link>

                      {/* No mobile não há hover: os cinco produtos ficam listados
                          sob Soluções, em vez de escondidos atrás de um toque. */}
                      {item.key === 'solutions' && (
                        <div id="solucoes-mobile" className="mt-3 ml-1 flex flex-col gap-2 border-l border-white/10 pl-4">
                          {SOLUCOES.map((solucao) => (
                            <Link
                              key={solucao.slug}
                              to={`/solucoes/${solucao.slug}`}
                              className="marca text-base text-on-surface-variant transition-colors hover:text-primary-container"
                            >
                              <NomeDeProduto nome={solucao.nome} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="border-t border-white/5 pt-6">
                  <Link
                    onClick={() => evento('cta_click', { cta: 'menu_mobile', destino: '/contato' })}
                    to="/contato"
                    data-evento="cta_click"
                    data-cta="menu_mobile"
                    data-destino="/contato"
                    className="block w-full rounded-2xl bg-primary-container py-4 text-center font-display text-sm font-medium uppercase tracking-widest text-on-primary"
                  >
                    {t('nav.cta')}
                  </Link>
                </div>
              </div>
            </div>
          </details>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
