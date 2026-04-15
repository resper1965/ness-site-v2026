import BlueDot from '../components/BlueDot';
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
LayoutGrid,
  Menu,
  X,
  Sparkles} from "lucide-react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;

const CELEBRATION_CONFIG = {
  active: true, // Set to true to enable celebration
  label: `${YEARS_OF_LEGACY} anos`,
  title: `${YEARS_OF_LEGACY} anos de engenharia de precisão`,
  message: `estamos celebrando ${YEARS_OF_LEGACY} anos de inovação, resiliência e parcerias de sucesso. obrigado por fazer parte da nossa história.`,
  startDate: "2024-04-14", // User will provide the exact date
  durationDays: 7,
  foundationYear: FOUNDATION_YEAR,
  currentYear: CURRENT_YEAR
};


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const menuItems = [
    { key: "solutions", label: t("nav.solutions"), to: "/solucoes" },
    { key: "sobre", label: t("nav.about"), to: "/sobre" },
    { key: "portfólio", label: t("nav.portfolio"), to: "/portfólio" },
    { key: "blog", label: t("nav.blog"), to: "/blog" },
    { key: "carreiras", label: t("nav.careers"), to: "/carreiras" },
    { key: "contato", label: t("nav.contact"), to: "/contato" }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl glass rounded-full flex justify-between items-center px-6 md:px-8 py-3 z-50 nebula-shadow">
        <Link to="/" className="text-2xl font-display tracking-tighter text-white lowercase-all">
          ness<BlueDot />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {CELEBRATION_CONFIG.active && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 animate-pulse">
              <Sparkles size={12} className="text-primary-container" />
              <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest">{CELEBRATION_CONFIG.label}</span>
            </div>
          )}
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="text-on-surface-variant tracking-tight text-[10px] lg:text-xs uppercase hover:text-primary transition-colors duration-300 font-bold"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            {['pt', 'en', 'es'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`px-2 py-1 rounded-full text-[9px] uppercase font-bold transition-all ${
                  i18n.language.startsWith(lng) 
                    ? "bg-primary-container text-on-primary" 
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {lng}
              </button>
            ))}
          </div>

          <button className="hidden lg:flex text-on-surface-variant hover:text-white transition-colors">
            <LayoutGrid size={20} />
          </button>
          <button className="hidden sm:flex bg-primary-container text-on-primary px-6 py-2 rounded-full font-display font-bold text-xs uppercase scale-95 active:scale-90 transition-all hover:brightness-110">
            {t('nav.contact')}
          </button>
          
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors"
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
                    className={`px-4 py-2 rounded-full text-xs uppercase font-bold transition-all ${
                      i18n.language.startsWith(lng) 
                        ? "bg-primary-container text-on-primary" 
                        : "bg-white/5 text-on-surface-variant"
                    }`}
                  >
                    {lng === 'pt' ? 'Português' : lng === 'en' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>

              {menuItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-display font-semibold text-white lowercase-all tracking-tighter"
                  >
                    {item.label}<BlueDot />
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8 border-t border-white/5"
              >
                <button className="w-full bg-primary-container text-on-primary py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-sm">
                  começar agora
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export default Navbar;
