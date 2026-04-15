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
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight leading-snug mb-4 lowercase">
              {t('cta.title')}
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed font-light">
              {t('cta.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <button className="bg-white text-surface px-8 py-3 rounded-full font-display font-semibold text-sm hover:bg-primary-container hover:text-on-primary transition-all shadow-lg shadow-primary-container/20">
              {t('cta.button')}
            </button>
            <p className="text-on-surface-variant/50 text-center text-xs font-light">{t('cta.support')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};


export default CTA;
