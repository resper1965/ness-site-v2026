import BlueDot from '../components/BlueDot';
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Sparkles } from "lucide-react";

import { YEARS_OF_LEGACY } from '../constants/brand';
import { useBrand } from '../config/brand';

const Navbar = () => {
  const BRAND = useBrand();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const legacyLabel = t('nav.celebration.label', { years: YEARS_OF_LEGACY, defaultValue: `${YEARS_OF_LEGACY} Anos` });

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
        <Link to="/" className="text-2xl font-display tracking-tighter text-white lowercase-all">
          {brandMark}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30" title={`${YEARS_OF_LEGACY} anos de tecnologia de precisão`}>
            <Sparkles size={12} className="text-primary-container" aria-hidden="true" />
            <span className="text-[11px] font-bold text-primary-container uppercase tracking-widest">{legacyLabel}</span>
          </div>
          {menuItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`tracking-wide text-[11px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm ${
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
                className={`px-2 py-1 rounded-full text-[11px] uppercase font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
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
                  className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
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
                </div>
              );
            })}

            <div className="pt-8 border-t border-white/5 anim-fade-up anim-delay-4">
              <Link
                to="/contato"
                onClick={() => setIsOpen(false)}
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
