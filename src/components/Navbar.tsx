import BlueDot from '../components/BlueDot';
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Sparkles } from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';
import { BRAND } from '../config/brand';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const CELEBRATION_CONFIG = {
    active: true,
    label: t('nav.celebration.label', { years: YEARS_OF_LEGACY, defaultValue: `${YEARS_OF_LEGACY} Anos` }),
    title: t('nav.celebration.title', { years: YEARS_OF_LEGACY, defaultValue: `Celebrando ${YEARS_OF_LEGACY} Anos` }),
    message: t('nav.celebration.message', { years: YEARS_OF_LEGACY, defaultValue: `Há ${YEARS_OF_LEGACY} anos construindo o futuro com precisão.` }),
    startDate: "2024-04-14",
    durationDays: 7,
    foundationYear: FOUNDATION_YEAR,
    currentYear: CURRENT_YEAR
  };

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

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

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass rounded-full flex justify-between items-center px-6 md:px-8 py-3 z-50 nebula-shadow">
        <Link to="/" className="text-2xl font-display tracking-tighter text-white lowercase-all">
          {(BRAND === 'trustness' || location.pathname === '/trustness') ? (
            <>trustness<BlueDot /></>
          ) : (BRAND === 'forense' || location.pathname === '/forense') ? (
            <>forense<BlueDot />io</>
          ) : (
            <>ness<BlueDot /></>
          )}
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {CELEBRATION_CONFIG.active && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30">
              <Sparkles size={12} className="text-primary-container" />
              <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest">{CELEBRATION_CONFIG.label}</span>
            </div>
          )}
          {menuItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`tracking-tight text-[10px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm ${
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
          <div className="hidden sm:flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            {['pt', 'en', 'es'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                aria-label={`Alterar idioma para ${lng.toUpperCase()}`}
                className={`px-2 py-1 rounded-full text-[9px] uppercase font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary-container ${
                  i18n.language.startsWith(lng) 
                    ? "bg-primary-container text-on-primary" 
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {lng}
              </button>
            ))}
          </div>

          <Link
            to="/contato"
            className="hidden sm:flex bg-primary-container text-on-primary px-6 py-2 rounded-full font-display font-bold text-xs uppercase scale-95 active:scale-90 transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            {t('nav.contact')}
          </Link>
          
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={isOpen}
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-4 mb-4">
                {['pt', 'en', 'es'].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      changeLanguage(lng);
                      setIsOpen(false);
                    }}
                    aria-label={`Alterar idioma para ${lng.toUpperCase()}`}
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
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={`text-3xl font-display font-semibold lowercase-all tracking-tighter ${
                        active ? "text-primary-container" : "text-white"
                      }`}
                    >
                      {item.label}{active && <BlueDot />}
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8 border-t border-white/5"
              >
                <Link
                  to="/contato"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center bg-primary-container text-on-primary py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-sm"
                >
                  {t('nav.cta')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export default Navbar;
