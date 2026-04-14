import React, {  } from "react";
import { useTranslation } from "react-i18next";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-8 bg-surface">
      <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative bg-surface-container-low p-12 md:p-24 border border-white/5 nebula-shadow">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary-container/10 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-display font-semibold text-white tracking-tighter leading-tight mb-6 lowercase-all">
              {t('cta.title')}
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed font-light">
              {t('cta.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button className="bg-white text-surface px-12 py-5 rounded-full font-display font-bold text-xl hover:bg-primary-container hover:text-on-primary transition-all shadow-2xl shadow-primary-container/20">
              {t('cta.button')}
            </button>
            <p className="text-on-surface-variant/50 text-center text-sm font-light">{t('cta.support')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};


export default CTA;
