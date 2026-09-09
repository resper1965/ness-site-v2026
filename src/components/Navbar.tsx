import BlueDot from '../components/BlueDot';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";

import { useBrand } from '../config/brand';
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
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


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

  // O idioma vive na URL: trocar de idioma é navegar. Assim a escolha é
  // compartilhável, indexável e sobrevive a um recarregamento.
  const [menuSolucoes, setMenuSolucoes] = useState(false);

  // O menu de soluções fecha ao navegar e no Esc — abrir é fácil, sair tem
  // que ser mais fácil ainda.
  useEffect(() => { setMenuSolucoes(false); }, [location.pathname]);
  useEffect(() => {
    if (!menuSolucoes) return;
    const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuSolucoes(false); };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [menuSolucoes]);

  const changeLanguage = (lng: string) => {
    navigate(rotaNoIdioma(location.pathname, lng as Idioma) + location.search);
  };

  // Fecha o menu ao navegar e ao pressionar Esc; trava o scroll enquanto aberto
  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const brandMark = (BRAND === 'trustness' || location.pathname === '/trustness')
    ? <>trustness<BlueDot /></>
    : (BRAND === 'forense' || location.pathname === '/forense')
      ? <>forense<BlueDot />io</>
      : <>ness<BlueDot /></>;

  return (
    <>
      <nav aria-label="Principal" className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass rounded-full flex justify-between items-center px-5 md:px-8 py-2.5 md:py-3 z-50 nebula-shadow">
        <Link to="/" className="marca text-2xl text-white">
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
                <div key={item.key} className="relative">
                  <button
                    type="button"
                    aria-expanded={menuSolucoes}
                    aria-controls="menu-solucoes"
                    /* Só clique: abrir no hover e fechar no clique é o padrão
                       que confunde no mouse e não existe no toque. */
                    onClick={() => setMenuSolucoes((aberto) => !aberto)}
                    className={`flex items-center gap-1 py-2 tracking-wide text-[11px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm ${
                      active ? 'text-primary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={12} aria-hidden="true" className={menuSolucoes ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  {menuSolucoes && (
                    <div
                      id="menu-solucoes"
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[320px]"
                    >
                      <div className="bg-surface-container-low/98 backdrop-blur-xl rounded-3xl border border-white/10 p-3 nebula-shadow">
                        {SOLUCOES.map((solucao) => (
                          <Link
                            key={solucao.slug}
                            to={`/solucoes/${solucao.slug}`}
                            className="block px-4 py-2.5 rounded-2xl hover:bg-white/5 transition-colors"
                          >
                            <span className="block text-xs font-bold text-white lowercase-all">{solucao.nome}</span>
                            <span className="block text-[11px] text-on-surface-variant leading-snug">{solucao.resumo}</span>
                          </Link>
                        ))}
                        {/* Serviços e Verticais saíram da home: sem lugar no
                            menu, só se chegaria neles pela URL. */}
                        <div className="mt-1 pt-2 border-t border-white/10 flex gap-2">
                          <Link to="/servicos" className="flex-1 px-3 py-2 rounded-xl text-[11px] text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors text-center lowercase-all">
                            {t('nav.services', 'serviços')}
                          </Link>
                          <Link to="/verticais" className="flex-1 px-3 py-2 rounded-xl text-[11px] text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors text-center lowercase-all">
                            verticais
                          </Link>
                        </div>

                        <Link
                          to="/assessment/cyber"
                          onClick={() => evento('cta_click', { cta: 'megamenu_diagnostico', destino: '/assessment/cyber' })}
                          className="block mt-1 px-4 py-2.5 rounded-2xl bg-primary-container/10 text-primary-container text-[11px] font-bold uppercase tracking-widest text-center hover:bg-primary-container hover:text-on-primary transition-colors"
                        >
                          {t('nav.assessment', 'diagnóstico gratuito')}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center py-2 tracking-wide text-[11px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm ${
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
          <div className="hidden sm:flex items-center bg-white/5 rounded-full p-1 border border-white/10" role="group" aria-label={t('a11y.language', 'idioma')}>
            {['pt', 'en', 'es'].map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => changeLanguage(lng)}
                aria-label={`Alterar idioma para ${lng.toUpperCase()}`}
                aria-pressed={i18n.language.startsWith(lng)}
                className={`px-3 py-2 rounded-full text-[11px] uppercase font-bold tracking-wide transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
                  i18n.language.startsWith(lng)
                    ? "bg-primary-container text-on-primary"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {lng}
              </button>
            ))}
          </div>

          {/* CTA — visível também no mobile */}
          <Link
            onClick={() => evento('cta_click', { cta: 'navbar', destino: '/contato' })}
            to="/contato"
            className="bg-primary-container text-on-primary px-4 md:px-6 py-2 rounded-full font-display font-bold text-[11px] md:text-xs uppercase tracking-wide transition-all hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-container whitespace-nowrap"
          >
            {t('nav.contact')}
          </Link>

          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay (CSS only) */}
      {isOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl pt-24 px-8 anim-menu-in overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-3 mb-2" role="group" aria-label={t('a11y.language', 'idioma')}>
              {['pt', 'en', 'es'].map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => { changeLanguage(lng); setIsOpen(false); }}
                  aria-pressed={i18n.language.startsWith(lng)}
                  className={`px-5 py-3 rounded-full text-xs uppercase font-bold tracking-wide transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
                    i18n.language.startsWith(lng)
                      ? "bg-primary-container text-on-primary"
                      : "bg-white/5 text-on-surface-variant"
                  }`}
                >
                  {lng === 'pt' ? 'Português' : lng === 'en' ? 'English' : 'Español'}
                </button>
              ))}
            </div>

            {menuItems.map((item, i) => {
              const active = isActive(item.to);
              return (
                <div key={item.key} className={`anim-fade-up anim-delay-${Math.min(i + 1, 4)}`}>
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`text-3xl font-display font-semibold lowercase-all tracking-tighter ${
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
                          onClick={() => setIsOpen(false)}
                          className="text-sm text-on-surface-variant hover:text-primary-container transition-colors lowercase-all"
                        >
                          {solucao.nome}
                        </Link>
                      ))}
                      <Link to="/servicos" onClick={() => setIsOpen(false)} className="text-sm text-on-surface-variant hover:text-primary-container transition-colors lowercase-all">
                        {t('nav.services', 'serviços')}
                      </Link>
                      <Link to="/verticais" onClick={() => setIsOpen(false)} className="text-sm text-on-surface-variant hover:text-primary-container transition-colors lowercase-all">
                        verticais
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-8 border-t border-white/5 anim-fade-up anim-delay-4">
              <Link
                onClick={() => { setIsOpen(false); evento('cta_click', { cta: 'menu_mobile', destino: '/contato' }); }}
                to="/contato"
                className="w-full block text-center bg-primary-container text-on-primary py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-sm"
              >
                {t('nav.cta')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
